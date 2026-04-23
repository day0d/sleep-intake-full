# Storage Migration Plan: Add Google Drive as Pluggable Storage Backend

## Context

The current app uses Supabase for database + file storage. The user wants Google Drive as an alternative storage backend with organized folder/file naming. **Supabase stays as a module** — both backends are pluggable behind a shared interface so either can be used via a config flag.

## Architecture: Storage Adapter Pattern

```
lib/storage/
  ├── types.ts          ← shared StorageAdapter interface
  ├── supabase.ts       ← existing Supabase logic, extracted here
  ├── google-drive.ts   ← new Google Drive implementation
  └── index.ts          ← reads STORAGE_PROVIDER env var, exports the active adapter
```

Both adapters implement the same interface:

```ts
interface StorageAdapter {
  /** Upload a file, return a storage path/ID */
  uploadFile(folder: string, fileName: string, data: Buffer, mimeType: string): Promise<string>;
  /** Upload the assessment markdown */
  uploadAssessment(folder: string, fileName: string, markdown: string): Promise<string>;
  /** Get a shareable/signed URL for a file */
  getFileUrl(pathOrId: string): Promise<string>;
  /** Get a link to the submission folder */
  getFolderUrl(folder: string): Promise<string>;
}
```

The submit API route calls `getStorageAdapter()` which returns whichever adapter matches the `STORAGE_PROVIDER` env var (`"supabase"` or `"google-drive"`).

## Google Drive Specifics

**Auth:** Service account (JSON key, never expires, no OAuth flow)

**Folder structure:**
```
Sleep Intake Assessments/                         ← shared parent folder
  └── 2026-04-18 - John Doe - Sleep Intake/       ← per-submission folder
      ├── John-Doe_bed.jpg
      ├── John-Doe_nightstand.jpg
      ├── John-Doe_windows.jpg
      ├── John-Doe_bedroom-lights-on.jpg
      ├── John-Doe_bedroom-lights-off.jpg
      ├── John-Doe_living-space-1.jpg
      ├── John-Doe_living-space-2.jpg
      ├── John-Doe_living-space-3.jpg
      └── John-Doe_sleep-intake_2026-04-18.md
```

**File naming:**
- Folder: `{YYYY-MM-DD} - {Full Name} - Sleep Intake`
- Photos: `{Name-Slug}_{photo-type}.jpg`
- Assessment: `{Name-Slug}_sleep-intake_{YYYY-MM-DD}.md`

## Upload Flow Change

**Current (Supabase):** Photos upload individually during form steps via signed URLs.

**New (both backends):** Photos compress client-side and hold in browser memory. Everything uploads at once on final submit via multipart POST. This simplifies the flow and works with any backend.

The Supabase adapter's `uploadFile` still writes to Supabase Storage. The Google Drive adapter writes to Drive. The form/API don't know which.

## Files Modified

| File | Change |
|------|--------|
| `lib/storage/types.ts` | NEW — StorageAdapter interface + naming helpers |
| `lib/storage/supabase.ts` | NEW — extract existing Supabase upload logic into adapter |
| `lib/storage/google-drive.ts` | NEW — Google Drive adapter using service account |
| `lib/storage/index.ts` | NEW — factory that returns the active adapter |
| `lib/upload.ts` → `lib/compress.ts` | Rewrite — compress-only, no upload |
| `components/file-upload.tsx` | Update — compress + hold blob, no network upload |
| `app/page.tsx` | Update — hold photo blobs in state, multipart submit |
| `app/api/submit/route.ts` | Rewrite — use storage adapter, parse multipart |
| `app/api/upload-url/route.ts` | Keep (still used if Supabase is active backend) |
| `lib/supabase-server.ts` | Keep as-is |
| `lib/supabase-browser.ts` | Keep as-is (not used by new flow, but available) |

## Env Vars

```env
# Storage backend switch
STORAGE_PROVIDER=google-drive   # or "supabase"

# Google Drive (only needed when STORAGE_PROVIDER=google-drive)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GOOGLE_DRIVE_FOLDER_ID=1abc...xyz

# Supabase (only needed when STORAGE_PROVIDER=supabase)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SECRET_KEY=eyJ...

# Always needed
RESEND_API_KEY=re_...
ADMIN_EMAIL=derrick@...
NEXT_PUBLIC_NOTION_CALENDAR_URL=https://...
```

## Implementation Tasks

1. **Create storage adapter interface** — `lib/storage/types.ts` with shared types + naming helpers
2. **Extract Supabase adapter** — move existing upload logic into `lib/storage/supabase.ts`
3. **Build Google Drive adapter** — `lib/storage/google-drive.ts` with service account auth
4. **Create adapter factory** — `lib/storage/index.ts` reads env var, returns adapter
5. **Compress-only client lib** — rewrite `lib/upload.ts` → `lib/compress.ts`
6. **Update FileUpload component** — compress + store blob in callback, no network
7. **Update form shell** — hold photo blobs in state, build multipart FormData on submit
8. **Rewrite submit API route** — parse multipart, use adapter for storage, keep email
9. **Install googleapis** — `npm install googleapis`
10. **Google Drive setup (manual)** — create project, service account, share folder, set env vars
11. **Test end-to-end with Google Drive** — verify folder + files appear correctly
12. **Test Supabase still works** — switch env var back, verify existing flow

## Verification

1. With `STORAGE_PROVIDER=google-drive`: submit form, verify files in Drive folder with correct naming
2. With `STORAGE_PROVIDER=supabase`: submit form, verify files in Supabase Storage
3. Both: verify email notification with working links
4. Both: verify assessment.md content is correct

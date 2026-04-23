# Sleep Environment Assessment — Intake App Design Spec

**Date:** 2026-04-16 (updated 2026-04-20)
**Status:** Approved / In Production

## Overview

A mobile-first web app where sleep consulting clients submit photos and answer questions about their sleep environment before a discovery call. Submission data is structured for easy AI consumption when generating private reports.

## Decisions Summary

| Decision | Choice | Rationale |
|---|---|---|
| Repo | Standalone (`SleepIntake`) | Separate from the static sales site |
| Framework | Next.js (App Router) + TypeScript | Modern React, SSR-capable, Vercel-native |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, accessible components |
| Hosting | Vercel (Hobby plan) | Free for non-commercial use during dev |
| File storage | Pluggable adapter (Google Drive or Supabase) | Switched via `STORAGE_PROVIDER` env var |
| Active storage | Google Drive (service account) | Organized folder structure, shareable links |
| Email | Resend (free tier) | Lightweight notification with links |
| Form handling | React Hook Form + Zod | Validation per-step and on final submit |
| Booking | Notion Calendar iframe embed | Client has scheduling link ready |
| Upload strategy | Client-side compression → blobs held in state → multipart POST on final submit |
| Video | Removed — photos only | Simplified v1 scope |
| Architecture | Simple 7-step form, client-side state only, no drafts, no DB |

## User Flow

1. Client arrives at the form via a shared link
2. Completes 7 steps on their phone (~10 minutes)
3. Step 7 embeds the Notion Calendar scheduling link
4. Client books the call, then taps "Submit to receive your free sleep report"
5. All photos + form data upload at once → Google Drive folder created → admin emailed
6. Client sees confirmation screen

Form data is held in React state throughout. No partial saves. Submission uploads everything in one multipart POST.

## Form Steps

| Step | Component | Content |
|---|---|---|
| 1 | `basics.tsx` | Name + email |
| 2 | `bedroom-photos.tsx` | 3 bedroom photos: bed, nightstand, windows |
| 3 | `bedroom-environment.tsx` | 2 light check photos: lights on, lights off (blinds closed) |
| 4 | `living-space.tsx` | 3 evening space photos: wide shot, screens/lighting, usual spot |
| 5 | `sleep-setup.tsx` | Sleep gear, phone location, bed sharing, bedtime wear |
| 6 | `signals.tsx` | Sleep issues (multi-select) + sweating/shivering |
| 7 | `booking.tsx` | Notion Calendar iframe + submit button |

## UI Design (Airbnb-Inspired)

### Design Principles
- **One focus per screen** — bold heading, minimal content, no cognitive overload
- **Consistent navigation chrome** — step pill, back/close, sticky bottom bar
- **Generous whitespace + large tap targets** — nothing cramped on mobile
- **Warm, not clinical** — off-white background, soft accent colors, playful microcopy

### Navigation Shell (every step)
- **Top bar:** Back arrow (left), centered pill badge `"Section name . 3 of 7"`, spacer (right) — sticky, opaque
- **Bottom bar:** Sticky, opaque. "Back" on left, "Next" on right (black pill button). Hidden on booking step.
- **Content area:** White card with rounded top corners, centered content, generous vertical spacing

### Color & Typography
- **Background:** Warm off-white/cream (`hsl(36 33% 97%)`)
- **Cards:** White (`hsl(0 0% 100%)`) with subtle shadow or border
- **Primary buttons:** Dark pill (`bg-foreground text-background`)
- **Font:** DM Sans, bold large headings
- **Selected state:** Dark fill + light text (`border-foreground bg-foreground text-background`)

### Shared Style Constants (`lib/ui-styles.ts`)
```typescript
cardStyles.selected   // 2-column grid toggle cards (Sleep Setup, Signals)
cardStyles.unselected
pillStyles.selected   // Pill row toggles (Yes/No, sweating options)
pillStyles.unselected
```

## Photo Keys

```
bed               // Step 2: your bed, wide shot
nightstand        // Step 2: nightstand / beside the bed
windows           // Step 2: window coverings as they are now
bedroomLightsOn   // Step 3: blinds closed, all lights on
bedroomLightsOff  // Step 3: same spot, all lights off
livingSpace1      // Step 4: wide shot of evening space
livingSpace2      // Step 4: screens and lighting
livingSpace3      // Step 4: usual spot (couch, chair)
```

## Storage Architecture

### Adapter Pattern
Both backends implement `StorageAdapter` (in `lib/storage/types.ts`):
```typescript
interface StorageAdapter {
  createSubmissionFolder(folderName: string): Promise<string>
  uploadFile(folderId: string, fileName: string, data: Buffer, mimeType: string): Promise<string>
  uploadAssessment(folderId: string, fileName: string, markdown: string): Promise<string>
  getFileUrl(pathOrId: string): Promise<string>
  getFolderUrl(folderId: string): Promise<string>
}
```

Switch via env var: `STORAGE_PROVIDER=google-drive` (or `supabase`).

### Google Drive Folder Structure
```
Sleep Intake Assessments/
  └── 2026-04-18 - John Doe - Sleep Intake/
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

### Upload Flow
1. User selects/takes photo in the app
2. Image compresses client-side (browser-image-compression)
3. Blob stored in React state (`photoBlobs`)
4. On final submit: multipart FormData POST to `/api/submit`
5. Server creates Google Drive folder, uploads all files, sends email

## API Route

### `POST /api/submit`

**Content-Type:** `multipart/form-data`

**Parts:**
- `formData` (string): JSON-encoded form fields + `submissionId`
- `photo_{key}` (Blob): one part per uploaded photo (e.g., `photo_bed`, `photo_nightstand`)

**Response:** `{ success: true, id: string }`

## Email Notification (to Admin)

Sent via Resend on each submission.

**Subject:** `New Sleep Assessment: {name}`

**Body:**
```
New submission from {name} ({email})
Submitted: {timestamp}

Folder: {Google Drive folder URL}

Assessment: {assessment.md URL}

Photos:
bed: {url}
nightstand: {url}
...
```

## Assessment Markdown (per submission)

Generated server-side, stored as `{Name-Slug}_sleep-intake_{YYYY-MM-DD}.md` in Drive:

```markdown
# Sleep Assessment: {name}
## Submitted: {date}

## Sleep Space Setup
- Phone at night: "..."
- Items owned: ...
- Blue-light glasses color: ...
- Shares bed: yes/no
- Shares blanket: yes/no/N/A
- Bedtime wear: "..."
- Other bedroom uses: "..."

## Sleep Signals
- Issues: ...
- Sweating/shivering: ...

## Photos
- Bed: {url or "Not uploaded"}
...
```

## Environment Variables

```env
STORAGE_PROVIDER=google-drive        # or "supabase"
GOOGLE_SERVICE_ACCOUNT_KEY={...}     # JSON string of service account key
GOOGLE_DRIVE_FOLDER_ID=1abc...       # Parent folder ID in Google Drive
RESEND_API_KEY=re_...
ADMIN_EMAIL=...
NEXT_PUBLIC_NOTION_CALENDAR_URL=...
```

## Project Structure (current)

```
SleepIntake/
  app/
    layout.tsx
    page.tsx                       # 7-step form shell
    confirmation/page.tsx
    api/submit/route.ts            # Multipart POST handler
    api/upload-url/route.ts        # Legacy Supabase signed URL (unused in GDrive mode)
    globals.css                    # CSS variables — must use hsl() wrappers for Tailwind v4
  components/
    form-steps/
      basics.tsx
      bedroom-photos.tsx
      bedroom-environment.tsx
      living-space.tsx
      sleep-setup.tsx
      signals.tsx
      booking.tsx
    progress-bar.tsx
    file-upload.tsx                # Compress + store blob in callback
    ui/                            # shadcn/ui components
  lib/
    storage/
      types.ts                     # StorageAdapter interface + naming helpers
      google-drive.ts              # Google Drive adapter
      supabase.ts                  # Supabase adapter
      index.ts                     # Factory: reads STORAGE_PROVIDER, returns adapter
    compress.ts                    # Client-side image compression only (no upload)
    schema.ts                      # Zod schemas
    types.ts
    ui-styles.ts                   # Shared cardStyles / pillStyles constants
    generate-assessment.ts         # Markdown generator
  docs/
    sleep-intake-design.md         # This file
    storage-adapter-plan.md        # Original storage migration plan (implemented)
    storage-migration-analysis.md  # Architecture analysis that informed the migration
```

## Known Tailwind v4 Gotcha

CSS custom properties in `:root` must be complete CSS color values (e.g., `hsl(36 33% 97%)`), NOT bare HSL components (`36 33% 97%`). The v3 convention of bare values doesn't work with Tailwind v4's `@theme inline` — the browser receives an invalid color string and ignores it entirely.

## Out of Scope for v1

- AI report generation in the app
- Payment processing
- User accounts / client login
- Admin dashboard
- Partial save / draft resumption
- Video upload
- Multi-language support
- Analytics

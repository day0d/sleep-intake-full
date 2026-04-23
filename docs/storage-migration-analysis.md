# Supabase Storage → OneDrive/Google Drive Migration Analysis

## Executive Summary
The current architecture uses Supabase Storage for file persistence with a three-step flow: (1) client-side image compression, (2) signed URL generation via backend API, (3) direct browser upload. Migrating to OneDrive or Google Drive requires redesigning the upload mechanism and signed URL strategy, but the overall form-to-storage pattern is maintainable.

---

## Current Architecture Deep Dive

### File Flow (Current - Supabase)
```
Browser                    Backend                      Storage
  ↓                          ↓                             ↓
Compress image      →  POST /api/upload-url    →  createSignedUploadUrl()
Store in memory        (fileName, submissionId)     ↓
                                              Return {signedUrl, token, path}
                       ↓
Browser receives      
signed URL + token    
                       ↓
Upload directly to    
Supabase using        
browser SDK           
(uploadToSignedUrl)   
                       ↓
Return path string    
("submissionId/bed")  
stored in form state  
```

### Key Properties of Current System
| Property | Value | Impact |
|----------|-------|--------|
| **Upload Initiation** | Client-side (direct to storage) | Reduces backend load, faster uploads |
| **Authentication** | Supabase anon key (client), service role key (server) | Least-privilege for client uploads |
| **URL Type** | Signed URLs (7-day expiry) | Time-limited access, secure sharing |
| **Path Structure** | `${submissionId}/${fileName}` | Flat structure, easy to reference |
| **Compression** | Browser-side, max 0.5MB, max 1920px | Reduces bandwidth, consistent sizing |
| **Database Storage** | Paths only (strings in photoUrls object) | Decouples storage from database |

---

## Migration Comparison: OneDrive vs. Google Drive

### OneDrive Architecture

#### Upload Flow
**Option A: Direct Browser Upload (Preferred)**
```typescript
// Similar to current flow, but with OneDrive API
const { uploadUrl, expirationDateTime } = await getUploadSession();
// Browser uploads directly to uploadUrl
// OneDrive returns driveItem ID
```

**Option B: Backend-Proxied Upload (Simpler Auth)**
```typescript
// Backend receives file, uploads to OneDrive
// Returns driveItemId to store in database
```

#### Required Changes
| Component | Change | Complexity |
|-----------|--------|------------|
| **lib/upload.ts** | Replace Supabase SDK with @microsoft/microsoft-graph-client or direct HTTP | Medium |
| **api/upload-url** | Use Microsoft Graph API to get upload session instead of Supabase | Medium |
| **Signed URLs** | OneDrive returns `@microsoft.graph.downloadUrl` (time-limited by default) | Low |
| **Dependencies** | Add @microsoft/microsoft-graph-client (~50KB) or axios | Low |
| **Auth Strategy** | Use Azure AD service principal or client credentials flow | High |

#### Advantages
- **Native Microsoft integration** if customer uses O365
- **Shared Drive support** via Sites/Groups
- **Built-in versioning** (automatic file history)
- **One Drive sync** to local machines if desired

#### Disadvantages
- **Azure AD setup required** (not trivial for side projects)
- **OAuth complexity** (refresh tokens, consent screens)
- **Less REST-friendly** than Supabase (Graph API is verbose)
- **Path structure** (folder IDs vs. simple paths)

---

### Google Drive Architecture

#### Upload Flow
**Option A: Resumable Upload (Recommended)**
```typescript
// Backend initiates resumable upload session
// Browser uploads chunks to Google's upload endpoint
// Returns fileId to store in database
```

**Option B: Direct OAuth in Browser**
```typescript
// User grants permission in browser
// Browser uploads directly to Drive
// More user-friendly, but requires user interaction
```

#### Required Changes
| Component | Change | Complexity |
|-----------|--------|------------|
| **lib/upload.ts** | Replace Supabase SDK with @google-cloud/storage or axios + Google API | Medium |
| **api/upload-url** | Use Google Drive API to create resumable upload sessions | Medium |
| **Signed URLs** | Use webContentLink with access token (shorter expiry) | Medium |
| **Dependencies** | Add @google-cloud/storage or google-auth-library | Low |
| **Auth Strategy** | Service account JSON key or OAuth 2.0 with refresh tokens | Medium |

#### Advantages
- **No user authentication required** (service account approach)
- **Simple folder structure** (nested folders, human-readable paths)
- **Excellent for collaborative sharing** (built-in permissions)
- **Simpler API** than Microsoft Graph for basic operations

#### Disadvantages
- **Service account limits** (quota restrictions if many concurrent uploads)
- **Shared Drive setup** (additional complexity vs. personal Drive)
- **Access token expiry** (need refresh token strategy)
- **Less seamless** for desktop sync (vs. OneDrive)

---

## Migration Impact Analysis

### Files Requiring Changes

#### 1. **lib/upload.ts** (High Impact)
```typescript
// Current: Uses Supabase browser SDK
// New: Use fetch() + Google Drive API or Microsoft Graph

// Critical functions to rewrite:
- uploadImage()          // Core upload logic
- getSignedUploadUrl()   // Backend call for URL/token

// New functions needed:
- initializeUploadSession()  // Call backend to create upload endpoint
- handleUploadProgress()     // Adapt to new provider's progress API
```

#### 2. **app/api/upload-url/route.ts** (High Impact)
```typescript
// Current: Call Supabase storage.createSignedUploadUrl()
// New: Call Google Drive or Microsoft Graph API

// Logic shift:
- createSignedUploadUrl() → initUploadSession() or createUploadUrl()
- Path construction stays the same: `${submissionId}/${fileName}`
- But may need to track: fileId, parentFolderId, or driveItemId
```

#### 3. **app/api/submit/route.ts** (Medium Impact)
```typescript
// Current: Generate signed URLs for existing paths in storage
// New: Need to adjust for new provider's URL structure

// Changes:
- Replace supabase.storage.createSignedUrl() calls
- New: Use Google Drive webContentLink or OneDrive @microsoft.graph.downloadUrl
- Consider: Longer expiry handling (Google has shorter defaults)

// Database impact:
- photo_urls object may need driveItemId or fileId in addition to paths
- Consider: {path: "...", fileId: "..."} structure for flexibility
```

#### 4. **lib/supabase-server.ts** (Low Impact)
```typescript
// Current: Initializes Supabase service role client
// New: Initialize Google/Microsoft auth client instead

// Remove Supabase service role key
// Add: Google service account JSON or Microsoft Azure credentials
```

#### 5. **lib/supabase-browser.ts** (Low Impact)
```typescript
// Current: Client-side Supabase initialization
// New: Remove if using backend-only upload approach
//      Keep if using direct OAuth in browser

// If Google Drive with browser OAuth:
// - Add Google API initialization
// - Add user consent handling
// - Add token refresh logic
```

#### 6. **Environment Variables** (.env.local)
```bash
# Remove:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Add for Google Drive:
GOOGLE_SERVICE_ACCOUNT_JSON (base64-encoded or path)
GOOGLE_DRIVE_FOLDER_ID

# OR for OneDrive:
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
AZURE_TENANT_ID
ONEDRIVE_PARENT_FOLDER_ID
```

---

## Implementation Complexity Comparison

### Google Drive (Recommended for Simplicity)

**Complexity Score: 6/10**

**Pros:**
- Simpler API for file operations
- No complex folder permission model
- Service account eliminates user auth in browser
- Easy to test with small number of files

**Cons:**
- API quota limits (1000 requests/100 seconds per user)
- Need to handle rate limiting
- Service account quota lower than user uploads

**Effort Estimate:**
- lib/upload.ts: 4 hours
- api/upload-url: 2 hours
- api/submit: 1 hour
- Testing & debugging: 3 hours
- **Total: 10 hours**

---

### OneDrive (Recommended for Enterprise)

**Complexity Score: 7/10**

**Pros:**
- Better for Office 365 environments
- More built-in features (versioning, sharing)
- Supports Shared Drives for team collaboration

**Cons:**
- Microsoft Graph API is verbose
- OAuth setup with Azure AD required
- Token refresh token handling needed
- More environment configuration

**Effort Estimate:**
- Azure AD setup: 2 hours
- lib/upload.ts: 5 hours
- api/upload-url: 3 hours
- api/submit: 2 hours
- Testing & debugging: 4 hours
- **Total: 16 hours**

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Quota exhaustion** (Google Drive) | Medium | High | Implement rate limiting, batch uploads |
| **Token expiry** (OneDrive) | High | Medium | Implement refresh token rotation |
| **Upload interruption** | Medium | Medium | Add retry logic with exponential backoff |
| **File path conflicts** | Low | High | Use submissionId as folder, guarantee uniqueness |
| **Permission issues** | Medium | High | Test with restricted service account |
| **Signed URL expiry** | Low | Medium | Use provider's native expiry vs. custom tokens |

---

## Recommendation

**Choose Google Drive if:**
- Simplicity is priority
- Cost matters (free tier sufficient for small volume)
- Quick implementation needed
- No enterprise/Office 365 integration required

**Choose OneDrive if:**
- Customer already uses Microsoft 365
- Need Shared Drive / team collaboration
- Enterprise security requirements
- Long-term integration value justifies setup cost

---

## Next Steps

1. **Architecture Decision:** Choose provider based on above criteria
2. **SDK Selection:** Evaluate @google-cloud/storage vs. axios for Google; @microsoft/microsoft-graph-client vs. axios for OneDrive
3. **Auth Setup:** Configure service account (Google) or Azure AD (OneDrive)
4. **Migration Path:** Consider running both systems in parallel during transition
5. **Testing Strategy:** Set up integration tests with fake upload sessions before going live

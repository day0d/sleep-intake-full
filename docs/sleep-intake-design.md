# Sleep Environment Assessment — Intake App Design Spec

**Date:** 2026-04-16
**Status:** Approved

## Overview

A mobile-first web app where sleep consulting clients submit photos, a video walkthrough, and answer questions about their sleep environment before a discovery call. Submission data is structured for easy AI consumption when generating private reports.

## Decisions Summary

| Decision | Choice | Rationale |
|---|---|---|
| Repo | Standalone (`SleepIntake`) | Separate from the static sales site |
| Framework | Next.js (App Router) + TypeScript | Modern React, SSR-capable, Vercel-native |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, accessible components |
| Hosting | Vercel (Hobby plan) | Free for non-commercial use during dev |
| Database | Supabase (free tier) | Structured submission records |
| File storage | Supabase Storage (free tier) | Photos, video, and per-submission markdown docs |
| Email | Resend (free tier) | Lightweight notification with links |
| Form handling | React Hook Form + Zod | Validation per-step and on final submit |
| Booking | Notion Calendar iframe embed | Client has scheduling link ready |
| Upload strategy | Client-side image compression, direct-to-Supabase, eager (on selection) |
| Video compression | None for v1 (100MB file size limit) |
| Architecture | Simple multi-step form, client-side state only, no drafts |

## User Flow

1. Client arrives at the form via a shared link
2. Completes 5 sections on their phone (~10-15 minutes)
3. Section 5 embeds the Notion Calendar scheduling link
4. Client books the call, then taps "I've booked — submit my intake"
5. Submission saved to Supabase + markdown doc generated + admin emailed
6. Client sees confirmation screen

The form is not considered "submitted" until the client manually confirms they've booked. Form data is held in React state until that point.

## UI Design (Airbnb-Inspired)

### Design Principles
- **One focus per screen** — bold heading, minimal content, no cognitive overload
- **Consistent navigation chrome** — step pill, back/close, sticky bottom bar
- **Generous whitespace + large tap targets** — nothing cramped on mobile
- **Warm, not clinical** — off-white background, soft accent colors, playful microcopy

### Navigation Shell (every step)
- **Top bar:** Back arrow (left), centered pill badge `"Section name . 3 of 5"`, X close (right)
- **Bottom bar:** Sticky. "Back" on left, primary action on right (black pill button). Disabled state when required fields aren't complete.
- **Content area:** White card with rounded top corners, centered content, generous vertical spacing

### Color & Typography
- **Background:** Warm off-white/cream
- **Cards:** White with subtle shadow or border
- **Primary buttons:** Black pill (Airbnb style)
- **Font:** Clean sans-serif (Inter or DM Sans), bold large headings, comfortable body text
- **Accent:** Soft lavender or warm indigo for selected states and progress pill

### Section 1: The Basics
- Bold centered heading: "Let's start with the basics"
- Two stacked text inputs: Name, Email
- Large touch targets, lots of breathing room

### Section 2: Show Me Your Space
- Bold heading + gray subtitle: "Don't clean up — I want to see it as you actually live in it."
- Labeled upload cards in a scrollable list, each with:
  - Label (e.g., "Your bed — wide shot")
  - Hint text (e.g., "Include the whole bed + surroundings")
  - Tap to open camera/gallery
  - After upload: thumbnail preview with trash icon overlay
  - Progress indicator during compress/upload
- Video upload card is visually distinct (taller, camera icon, labeled "Video walkthrough . 30-60 seconds")
- Upload fields:
  - Photo 1: Your bed (wide shot showing whole bed + surroundings)
  - Photo 2: Your nightstand / whatever's next to your bed
  - Photo 3: View from your bed looking at the room
  - Photo 4: Your windows + window coverings (during the day)
  - Video: 30-60 second walkthrough — "Daytime. Lights off. Blinds closed. Point out where light is getting in."
  - Photo 5: Your main living space (where you spend evenings)
  - Photo 6: The lighting you use at night (show the actual bulbs/fixtures on)
- All uploads optional for v1. Encourage in microcopy but don't block submission.

### Section 3: Your Sleep Space Setup
- **Phone location:** Open text input (required)
- **Items owned:** 2-column card grid (Airbnb category style). Each item is a rounded card with icon/emoji + label. Tap to select (border highlights). Items:
  - Sleep mask, Earplugs, Blue-light blocking glasses, Sound machine, Fan, Air conditioning, Air purifier, Weighted blanket, Temperature-regulating bed/mattress
  - Conditional: if "Blue-light blocking glasses" selected, text input slides in: "What color are the lenses?"
- **Share bed with partner:** Yes/No pill toggle buttons (required)
  - Conditional: if Yes, "Share a blanket?" Yes/No pills
- **Bedtime wear:** Open text input (required)
- **Other bedroom uses:** Open text input (required), placeholder: "e.g., work, TV, meditation, reading"

### Section 4: Sleep Signals
- **Which apply to you?** 2-column card grid (at least one required):
  - Trouble falling asleep
  - Frequent wakeups
  - Sleep through but don't feel rested
  - None of the above
- **Wake up sweating or shivering?** Single-select pill row (required):
  - Sweating / Shivering / Both / No

### Section 5: Book Your Discovery Call
- Bold heading: "Last step — book your free discovery call"
- Subtitle: "Once you're booked, your submission comes straight to me."
- Notion Calendar iframe filling most of the screen
- Below iframe: black pill button "I've booked — submit my intake"

### Confirmation Screen
- Centered layout
- Checkmark or subtle illustration
- "Thanks, [name] — you're all set."
- "I'll review your submission and prepare for our call. If anything comes up beforehand, reply to the confirmation email."

## Data Flow

### Upload Flow
1. User taps upload card -> phone camera/gallery opens
2. Image selected -> client-side compression via `browser-image-compression` (max 1920px wide, target ~500KB)
3. Compressed file uploads directly to Supabase Storage (no Vercel function in path)
4. Returned public URL stored in React Hook Form state
5. Thumbnail preview renders on the card
6. Video: no compression, 100MB file size limit, direct upload to Supabase Storage

### Form State
- Single `useForm()` at page level (React Hook Form)
- Each step component receives form methods via props
- Zod schema validates per-step on "Next" tap
- Step navigation via `useState<number>` (no URL changes)

### Submission Flow
1. User taps "I've booked — submit my intake"
2. Full Zod validation runs client-side
3. `POST /api/submit` with JSON body (text answers + Supabase Storage URLs)
4. Server-side:
   a. Zod validation
   b. Insert row into Supabase `submissions` table
   c. Generate structured markdown doc, upload to Supabase Storage at `submissions/{id}/assessment.md`
   d. Send notification email via Resend
   e. Return `{ success: true, id }`
5. Client redirects to `/confirmation?name=...`

### Error Handling
- If DB insert succeeds but email fails: submission is saved, email error logged server-side, client sees success
- Upload failures: show error on the specific card with retry option
- Network errors on final submit: show error message, allow retry (data is still in form state)

## Data Model

### Supabase Table: `submissions`

```sql
create table submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone_location text not null,
  items_owned text[] default '{}',
  blue_light_glasses_color text,
  shares_bed_with_partner boolean not null,
  shares_blanket_with_partner boolean,
  bedtime_wear text not null,
  bedroom_other_uses text not null,
  sleep_signals text[] not null,
  sweating_shivering text not null,
  photo_urls jsonb default '{}',
  video_url text
);
```

### Supabase Storage Configuration

- **Bucket:** `submissions` (private — client photos should not be publicly accessible)
- **Access:** Server-side signed URLs with 7-day expiry for email links. Uploads use short-lived signed upload URLs generated by the API.

### Supabase Storage Structure

```
submissions/
  {submission-id}/
    assessment.md       # AI-ready structured doc
    bed.jpg
    nightstand.jpg
    room-view.jpg
    windows.jpg
    living-space.jpg
    night-lighting.jpg
    walkthrough.mp4
```

### AI-Ready Markdown Doc (per submission)

Generated server-side on submit and stored in Supabase Storage:

```markdown
# Sleep Assessment: {name}
## Submitted: {date}

## Sleep Space Setup
- Phone at night: "{phoneLocation}"
- Items owned: {itemsOwned joined}
- Blue-light glasses color: {color or "N/A"}
- Shares bed: {yes/no}
- Shares blanket: {yes/no or "N/A"}
- Bedtime wear: "{bedtimeWear}"
- Other bedroom uses: "{bedroomOtherUses}"

## Sleep Signals
- Issues: {sleepSignals joined}
- Sweating/shivering: {sweatingShivering}

## Photos
- Bed: {url or "Not uploaded"}
- Nightstand: {url or "Not uploaded"}
- Room view: {url or "Not uploaded"}
- Windows: {url or "Not uploaded"}
- Living space: {url or "Not uploaded"}
- Night lighting: {url or "Not uploaded"}

## Video
- Walkthrough: {url or "Not uploaded"}
```

## Email Notification (to Admin)

Sent via Resend on each submission. Lightweight — links only:

**Subject:** `New Sleep Assessment: {name}`

**Body:**
```
New submission from {name} ({email})
Submitted: {timestamp}

Assessment doc: {link to assessment.md in Supabase Storage}
Media folder: {link to submissions/{id}/ in Supabase Storage}
```

## API Route

### `POST /api/submit`

**Request body** (JSON):
```typescript
{
  name: string
  email: string
  photoUrls: {
    bed?: string
    nightstand?: string
    roomView?: string
    windows?: string
    livingSpace?: string
    nightLighting?: string
  }
  videoUrl?: string
  phoneLocation: string
  itemsOwned: string[]
  blueLightGlassesColor?: string
  sharesBedWithPartner: boolean
  sharesBlanketWithPartner?: boolean
  bedtimeWear: string
  bedroomOtherUses: string
  sleepSignals: string[]
  sweatingShivering: "sweating" | "shivering" | "both" | "no"
}
```

**Response:** `{ success: true, id: string }`

## Project Structure

```
SleepIntake/
  app/
    layout.tsx
    page.tsx                  # Multi-step intake form
    confirmation/
      page.tsx                # Post-submit confirmation
    api/
      submit/
        route.ts              # POST: DB insert + markdown gen + email
  components/
    form-steps/
      basics.tsx              # Section 1: Name + Email
      photos.tsx              # Section 2: Photo/video uploads
      sleep-setup.tsx         # Section 3: Sleep space questions
      signals.tsx             # Section 4: Sleep signals
      booking.tsx             # Section 5: Notion Calendar + confirm
    progress-bar.tsx
    file-upload.tsx            # Compress + upload to Supabase
    ui/                        # shadcn/ui components
  lib/
    supabase.ts               # Supabase client setup
    upload.ts                  # Client-side compress + upload
    schema.ts                  # Zod validation schemas
    types.ts
  docs/
    sleep-intake-design.md    # This file
  tailwind.config.ts
  next.config.ts
  package.json
```

## Validation Rules

- Name: required, non-empty
- Email: required, valid email format
- All Section 2 uploads: optional (encouraged in microcopy)
- Phone location: required
- Items owned: optional (multi-select)
- Shares bed with partner: required
- Bedtime wear: required
- Bedroom other uses: required
- Sleep signals: at least one checked
- Sweating/shivering: required selection

## Dependencies

```json
{
  "next": "latest",
  "react": "latest",
  "react-dom": "latest",
  "react-hook-form": "latest",
  "@hookform/resolvers": "latest",
  "zod": "latest",
  "@supabase/supabase-js": "latest",
  "resend": "latest",
  "browser-image-compression": "latest",
  "tailwindcss": "latest",
  "@tailwindcss/forms": "latest"
}
```

Plus shadcn/ui components added via CLI.

## Out of Scope for v1

- AI report generation in the app
- Payment processing
- User accounts / client login
- Admin dashboard (stretch goal)
- Partial save / draft resumption
- Multi-language support
- Analytics
- Video compression

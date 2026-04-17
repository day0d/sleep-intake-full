# Sleep Intake App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first intake form that collects sleep environment data (photos, video, questionnaire) from clients, stores it in Supabase, generates an AI-ready markdown doc, and emails the admin a notification with links.

**Architecture:** Next.js App Router (single-page multi-step form), React Hook Form + Zod for validation, Supabase for DB + Storage, Resend for email, Airbnb-inspired mobile UI with shadcn/ui components.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Supabase (DB + Storage), Resend, React Hook Form, Zod, browser-image-compression

**Spec:** `docs/sleep-intake-design.md`

---

## File Map

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout: fonts (DM Sans), global styles, metadata |
| `app/page.tsx` | Multi-step form shell: step state, form provider, step rendering, nav |
| `app/confirmation/page.tsx` | Post-submit confirmation screen |
| `app/api/submit/route.ts` | POST handler: validate, DB insert, generate markdown, email |
| `app/api/upload-url/route.ts` | POST handler: generate signed upload URL for Supabase Storage |
| `components/form-steps/basics.tsx` | Section 1: Name + Email inputs |
| `components/form-steps/photos.tsx` | Section 2: Photo/video upload cards |
| `components/form-steps/sleep-setup.tsx` | Section 3: Sleep space questions |
| `components/form-steps/signals.tsx` | Section 4: Sleep signals |
| `components/form-steps/booking.tsx` | Section 5: Notion Calendar embed + submit |
| `components/progress-bar.tsx` | Step pill indicator ("Photos . 2 of 5") |
| `components/file-upload.tsx` | Reusable upload card: compress, upload, preview, delete |
| `lib/supabase-server.ts` | Server-side Supabase client (service role key) |
| `lib/supabase-browser.ts` | Browser-side Supabase client (anon key, storage only) |
| `lib/schema.ts` | Zod schemas: per-step + full form |
| `lib/types.ts` | TypeScript types for form data |
| `lib/upload.ts` | Client-side: compress image + upload to signed URL |
| `lib/generate-assessment.ts` | Server-side: build the AI-ready markdown string |
| `.env.local` | Environment variables (Supabase, Resend) |

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `.env.local`, `.gitignore`

- [ ] **Step 1: Initialize the Next.js project**

```bash
cd /c/Users/yoder
npx create-next-app@latest SleepIntake --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

When prompted, accept defaults. This creates the project with App Router, TypeScript, Tailwind, and ESLint.

- [ ] **Step 2: Initialize git**

```bash
cd /c/Users/yoder/SleepIntake
git init
git add -A
git commit -m "chore: scaffold Next.js project"
```

- [ ] **Step 3: Install dependencies**

```bash
cd /c/Users/yoder/SleepIntake
npm install react-hook-form @hookform/resolvers zod @supabase/supabase-js resend browser-image-compression
```

- [ ] **Step 4: Initialize shadcn/ui**

```bash
cd /c/Users/yoder/SleepIntake
npx shadcn@latest init
```

When prompted:
- Style: Default
- Base color: Neutral
- CSS variables: Yes

- [ ] **Step 5: Add shadcn/ui components we'll need**

```bash
cd /c/Users/yoder/SleepIntake
npx shadcn@latest add button input label card progress
```

- [ ] **Step 6: Create `.env.local` with placeholder values**

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=re_your-api-key
ADMIN_EMAIL=derrick@example.com

# Notion Calendar
NEXT_PUBLIC_NOTION_CALENDAR_URL=https://cal.notion.so/your-scheduling-link
```

- [ ] **Step 7: Add `.env.local` to `.gitignore`**

Verify `.env.local` is already in `.gitignore` (create-next-app should include it). If not, add it.

- [ ] **Step 8: Set up the DM Sans font in `app/layout.tsx`**

Replace the contents of `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Sleep Environment Assessment",
  description: "Share your sleep space before your discovery call",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Update global CSS for warm theme**

Replace `app/globals.css` with Tailwind directives plus the warm color overrides:

```css
@import "tailwindcss";

:root {
  --background: 36 33% 97%;
  --foreground: 240 10% 10%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 10%;
  --primary: 240 6% 10%;
  --primary-foreground: 0 0% 98%;
  --accent: 250 40% 92%;
  --accent-foreground: 250 40% 30%;
  --muted: 36 20% 93%;
  --muted-foreground: 240 4% 46%;
  --border: 36 15% 89%;
  --ring: 250 40% 65%;
  --radius: 0.75rem;
}
```

- [ ] **Step 10: Create a placeholder `app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-foreground">
        Sleep Environment Assessment
      </h1>
    </main>
  );
}
```

- [ ] **Step 11: Verify the dev server starts**

```bash
cd /c/Users/yoder/SleepIntake
npm run dev
```

Expected: Dev server starts on http://localhost:3000, page shows "Sleep Environment Assessment" heading on a warm off-white background.

- [ ] **Step 12: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add -A
git commit -m "chore: add dependencies, shadcn/ui, DM Sans font, warm theme"
```

---

## Task 2: Zod Schemas & Types

**Files:**
- Create: `lib/types.ts`, `lib/schema.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```typescript
export type PhotoKey =
  | "bed"
  | "nightstand"
  | "roomView"
  | "windows"
  | "livingSpace"
  | "nightLighting";

export type SweatingShivering = "sweating" | "shivering" | "both" | "no";

export interface FormData {
  // Section 1
  name: string;
  email: string;
  // Section 2
  photoUrls: Partial<Record<PhotoKey, string>>;
  videoUrl?: string;
  // Section 3
  phoneLocation: string;
  itemsOwned: string[];
  blueLightGlassesColor?: string;
  sharesBedWithPartner: boolean;
  sharesBlanketWithPartner?: boolean;
  bedtimeWear: string;
  bedroomOtherUses: string;
  // Section 4
  sleepSignals: string[];
  sweatingShivering: SweatingShivering;
}

export interface SubmissionResponse {
  success: boolean;
  id: string;
}
```

- [ ] **Step 2: Create `lib/schema.ts`**

```typescript
import { z } from "zod";

// Section 1
export const basicsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
});

// Section 2 — all optional
export const photosSchema = z.object({
  photoUrls: z.object({
    bed: z.string().url().optional(),
    nightstand: z.string().url().optional(),
    roomView: z.string().url().optional(),
    windows: z.string().url().optional(),
    livingSpace: z.string().url().optional(),
    nightLighting: z.string().url().optional(),
  }),
  videoUrl: z.string().url().optional(),
});

// Section 3
export const sleepSetupSchema = z
  .object({
    phoneLocation: z.string().min(1, "Please tell us where you put your phone"),
    itemsOwned: z.array(z.string()).default([]),
    blueLightGlassesColor: z.string().optional(),
    sharesBedWithPartner: z.boolean({
      required_error: "Please select yes or no",
    }),
    sharesBlanketWithPartner: z.boolean().optional(),
    bedtimeWear: z.string().min(1, "Please tell us what you wear to bed"),
    bedroomOtherUses: z.string().min(1, "Please tell us how else you use your bedroom"),
  })
  .refine(
    (data) => {
      if (data.itemsOwned.includes("Blue-light blocking glasses")) {
        return !!data.blueLightGlassesColor;
      }
      return true;
    },
    {
      message: "Please tell us the lens color",
      path: ["blueLightGlassesColor"],
    }
  )
  .refine(
    (data) => {
      if (data.sharesBedWithPartner) {
        return data.sharesBlanketWithPartner !== undefined;
      }
      return true;
    },
    {
      message: "Please select yes or no",
      path: ["sharesBlanketWithPartner"],
    }
  );

// Section 4
export const signalsSchema = z.object({
  sleepSignals: z
    .array(z.string())
    .min(1, "Please select at least one option"),
  sweatingShivering: z.enum(["sweating", "shivering", "both", "no"], {
    required_error: "Please select an option",
  }),
});

// Full form (used on final submit)
export const fullFormSchema = basicsSchema
  .merge(photosSchema)
  .merge(
    z.object({
      phoneLocation: z.string().min(1),
      itemsOwned: z.array(z.string()).default([]),
      blueLightGlassesColor: z.string().optional(),
      sharesBedWithPartner: z.boolean(),
      sharesBlanketWithPartner: z.boolean().optional(),
      bedtimeWear: z.string().min(1),
      bedroomOtherUses: z.string().min(1),
      sleepSignals: z.array(z.string()).min(1),
      sweatingShivering: z.enum(["sweating", "shivering", "both", "no"]),
    })
  );

export type FullFormData = z.infer<typeof fullFormSchema>;
```

- [ ] **Step 3: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add lib/types.ts lib/schema.ts
git commit -m "feat: add Zod schemas and TypeScript types for form data"
```

---

## Task 3: Supabase Clients

**Files:**
- Create: `lib/supabase-server.ts`, `lib/supabase-browser.ts`

- [ ] **Step 1: Create `lib/supabase-server.ts`**

Server-side client uses the service role key for DB inserts, storage writes, and generating signed URLs.

```typescript
import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}
```

- [ ] **Step 2: Create `lib/supabase-browser.ts`**

Browser-side client uses the anon key. Used only for uploading to signed URLs.

```typescript
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);
```

- [ ] **Step 3: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add lib/supabase-server.ts lib/supabase-browser.ts
git commit -m "feat: add Supabase server and browser clients"
```

---

## Task 4: Upload Infrastructure

**Files:**
- Create: `app/api/upload-url/route.ts`, `lib/upload.ts`, `components/file-upload.tsx`

- [ ] **Step 1: Create `app/api/upload-url/route.ts`**

This route generates a signed upload URL server-side so the browser can upload directly to the private Supabase Storage bucket.

```typescript
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const { fileName, submissionId } = await request.json();

  if (!fileName || !submissionId) {
    return NextResponse.json(
      { error: "fileName and submissionId are required" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabase();
  const path = `${submissionId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("submissions")
    .createSignedUploadUrl(path);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
  });
}
```

- [ ] **Step 2: Create `lib/upload.ts`**

Client-side utility: compress an image, request a signed upload URL, upload the file, return the storage path.

```typescript
import imageCompression from "browser-image-compression";
import { supabase } from "./supabase-browser";

const IMAGE_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

const VIDEO_MAX_SIZE_MB = 100;

// Generate a unique submission ID for grouping uploads before the DB record exists
export function generateSubmissionId(): string {
  return crypto.randomUUID();
}

async function getSignedUploadUrl(
  fileName: string,
  submissionId: string
): Promise<{ signedUrl: string; token: string; path: string }> {
  const res = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, submissionId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to get upload URL");
  }

  return res.json();
}

export async function uploadImage(
  file: File,
  fileName: string,
  submissionId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Compress
  onProgress?.(10);
  const compressed = await imageCompression(file, IMAGE_OPTIONS);

  // Get signed URL
  onProgress?.(30);
  const { signedUrl, token, path } = await getSignedUploadUrl(
    fileName,
    submissionId
  );

  // Upload to signed URL
  onProgress?.(50);
  const { error } = await supabase.storage
    .from("submissions")
    .uploadToSignedUrl(path, token, compressed, {
      contentType: compressed.type,
    });

  if (error) throw new Error(error.message);

  onProgress?.(100);
  return path;
}

export async function uploadVideo(
  file: File,
  fileName: string,
  submissionId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (file.size > VIDEO_MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Video must be under ${VIDEO_MAX_SIZE_MB}MB`);
  }

  onProgress?.(10);
  const { signedUrl, token, path } = await getSignedUploadUrl(
    fileName,
    submissionId
  );

  onProgress?.(30);
  const { error } = await supabase.storage
    .from("submissions")
    .uploadToSignedUrl(path, token, file, {
      contentType: file.type,
    });

  if (error) throw new Error(error.message);

  onProgress?.(100);
  return path;
}
```

- [ ] **Step 3: Create `components/file-upload.tsx`**

Reusable upload card component matching the Airbnb-inspired design.

```tsx
"use client";

import { useRef, useState } from "react";
import { uploadImage, uploadVideo } from "@/lib/upload";
import { Trash2, Camera, Video, Loader2 } from "lucide-react";

interface FileUploadProps {
  label: string;
  hint: string;
  fileName: string;
  submissionId: string;
  type: "image" | "video";
  value?: string; // storage path if already uploaded
  onChange: (path: string | undefined) => void;
}

export function FileUpload({
  label,
  hint,
  fileName,
  submissionId,
  type,
  value,
  onChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const accept =
    type === "image"
      ? "image/jpeg,image/png,image/heic,image/heif"
      : "video/mp4,video/quicktime";

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);

    // Generate local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      const uploadFn = type === "image" ? uploadImage : uploadVideo;
      const path = await uploadFn(file, fileName, submissionId, setProgress);
      onChange(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreviewUrl(null);
      onChange(undefined);
    } finally {
      setProgress(null);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    setPreviewUrl(null);
    onChange(undefined);
  }

  const isUploading = progress !== null;
  const hasFile = !!value;
  const Icon = type === "video" ? Video : Camera;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture={type === "video" ? "environment" : undefined}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!hasFile && !isUploading ? (
        // Empty state — tap to upload
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center transition-colors hover:border-ring active:bg-muted ${
            type === "video" ? "py-10" : ""
          }`}
        >
          <Icon className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </button>
      ) : isUploading ? (
        // Uploading state
        <div className="w-full rounded-2xl border border-border bg-card p-6 text-center">
          {previewUrl && type === "image" && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto mb-3 h-24 w-24 rounded-xl object-cover opacity-50"
            />
          )}
          <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-muted-foreground" />
          <div className="mx-auto h-1.5 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-ring transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        // Uploaded state — show preview + delete
        <div className="relative w-full rounded-2xl border border-border bg-card overflow-hidden">
          {previewUrl && type === "image" ? (
            <img
              src={previewUrl}
              alt={label}
              className="h-40 w-full object-cover"
            />
          ) : (
            <div className="flex h-24 items-center justify-center bg-muted">
              <Video className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Video uploaded
              </span>
            </div>
          )}
          <div className="p-3">
            <p className="text-xs font-medium text-foreground">{label}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-foreground/80 p-1.5 text-background transition-colors hover:bg-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">
          {error}{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="underline"
          >
            Try again
          </button>
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Install lucide-react for icons**

```bash
cd /c/Users/yoder/SleepIntake
npm install lucide-react
```

- [ ] **Step 5: Verify the dev server still starts**

```bash
cd /c/Users/yoder/SleepIntake
npm run dev
```

Expected: No build errors.

- [ ] **Step 6: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add app/api/upload-url/route.ts lib/upload.ts components/file-upload.tsx package.json package-lock.json
git commit -m "feat: add upload infrastructure (signed URLs, compression, upload card)"
```

---

## Task 5: Progress Bar Component

**Files:**
- Create: `components/progress-bar.tsx`

- [ ] **Step 1: Create `components/progress-bar.tsx`**

The Airbnb-style pill showing section name and step number.

```tsx
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  sectionName: string;
}

const SECTION_NAMES = [
  "The Basics",
  "Your Space",
  "Sleep Setup",
  "Sleep Signals",
  "Book a Call",
];

export function ProgressBar({
  currentStep,
  totalSteps,
  sectionName,
}: ProgressBarProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5">
      <span className="text-xs font-medium text-background">{sectionName}</span>
      <span className="text-xs text-background/60">
        {currentStep} of {totalSteps}
      </span>
    </div>
  );
}

export { SECTION_NAMES };
```

- [ ] **Step 2: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add components/progress-bar.tsx
git commit -m "feat: add progress bar pill component"
```

---

## Task 6: Form Step — Section 1 (The Basics)

**Files:**
- Create: `components/form-steps/basics.tsx`

- [ ] **Step 1: Create `components/form-steps/basics.tsx`**

```tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicsProps {
  form: UseFormReturn<FormData>;
}

export function Basics({ form }: BasicsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col items-center px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Let&apos;s start with the basics
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        So I know who I&apos;m talking to.
      </p>

      <div className="mt-10 w-full max-w-sm space-y-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Your name
          </Label>
          <Input
            id="name"
            placeholder="First name is fine"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Your email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add components/form-steps/basics.tsx
git commit -m "feat: add Section 1 (The Basics) form step"
```

---

## Task 7: Form Step — Section 2 (Show Me Your Space)

**Files:**
- Create: `components/form-steps/photos.tsx`

- [ ] **Step 1: Create `components/form-steps/photos.tsx`**

```tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, PhotoKey } from "@/lib/types";
import { FileUpload } from "@/components/file-upload";

interface PhotosProps {
  form: UseFormReturn<FormData>;
  submissionId: string;
}

const PHOTO_FIELDS: {
  key: PhotoKey;
  label: string;
  hint: string;
  fileName: string;
}[] = [
  {
    key: "bed",
    label: "Your bed",
    hint: "Wide shot — include the whole bed + surroundings",
    fileName: "bed.jpg",
  },
  {
    key: "nightstand",
    label: "Your nightstand",
    hint: "Whatever's next to your bed",
    fileName: "nightstand.jpg",
  },
  {
    key: "roomView",
    label: "View from your bed",
    hint: "Looking out at the room from where you sleep",
    fileName: "room-view.jpg",
  },
  {
    key: "windows",
    label: "Your windows",
    hint: "Window coverings during the day",
    fileName: "windows.jpg",
  },
  {
    key: "livingSpace",
    label: "Your main living space",
    hint: "Where you spend your evenings",
    fileName: "living-space.jpg",
  },
  {
    key: "nightLighting",
    label: "Your nighttime lighting",
    hint: "Show the actual bulbs/fixtures you use at night, turned on",
    fileName: "night-lighting.jpg",
  },
];

export function Photos({ form, submissionId }: PhotosProps) {
  const { setValue, watch } = form;
  const photoUrls = watch("photoUrls") || {};
  const videoUrl = watch("videoUrl");

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Show me your space
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-center text-sm text-muted-foreground">
        Take photos and a short video walkthrough. Don&apos;t clean up — I want
        to see it as you actually live in it.
      </p>

      <div className="mt-8 space-y-4">
        {PHOTO_FIELDS.map((field) => (
          <FileUpload
            key={field.key}
            label={field.label}
            hint={field.hint}
            fileName={field.fileName}
            submissionId={submissionId}
            type="image"
            value={photoUrls[field.key]}
            onChange={(path) =>
              setValue(`photoUrls.${field.key}`, path, {
                shouldDirty: true,
              })
            }
          />
        ))}

        <div className="pt-4">
          <FileUpload
            label="Video walkthrough"
            hint="30-60 seconds. Daytime. Lights off. Blinds closed. Point out where light is getting in."
            fileName="walkthrough.mp4"
            submissionId={submissionId}
            type="video"
            value={videoUrl}
            onChange={(path) =>
              setValue("videoUrl", path, { shouldDirty: true })
            }
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add components/form-steps/photos.tsx
git commit -m "feat: add Section 2 (Show Me Your Space) form step"
```

---

## Task 8: Form Step — Section 3 (Sleep Space Setup)

**Files:**
- Create: `components/form-steps/sleep-setup.tsx`

- [ ] **Step 1: Create `components/form-steps/sleep-setup.tsx`**

```tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SleepSetupProps {
  form: UseFormReturn<FormData>;
}

const ITEMS = [
  { id: "Sleep mask", emoji: "😴" },
  { id: "Earplugs", emoji: "👂" },
  { id: "Blue-light blocking glasses", emoji: "🕶️" },
  { id: "Sound machine", emoji: "🔊" },
  { id: "Fan", emoji: "🌀" },
  { id: "Air conditioning", emoji: "❄️" },
  { id: "Air purifier", emoji: "🌬️" },
  { id: "Weighted blanket", emoji: "🛏️" },
  { id: "Temperature-regulating bed", emoji: "🌡️" },
];

export function SleepSetup({ form }: SleepSetupProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const itemsOwned = watch("itemsOwned") || [];
  const sharesBed = watch("sharesBedWithPartner");
  const hasBlueLight = itemsOwned.includes("Blue-light blocking glasses");

  function toggleItem(item: string) {
    const current = itemsOwned;
    const next = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    setValue("itemsOwned", next, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Your sleep space setup
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Tell me about your bedroom and habits.
      </p>

      <div className="mt-8 space-y-8">
        {/* Phone location */}
        <div>
          <Label className="text-sm font-medium">
            Where do you put your phone at night?
          </Label>
          <Input
            placeholder="e.g., nightstand, under my pillow, across the room"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("phoneLocation")}
          />
          {errors.phoneLocation && (
            <p className="mt-1 text-xs text-red-600">
              {errors.phoneLocation.message}
            </p>
          )}
        </div>

        {/* Items owned — card grid */}
        <div>
          <Label className="text-sm font-medium">
            Do you have any of the following?
          </Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {ITEMS.map((item) => {
              const selected = itemsOwned.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected
                      ? "border-ring bg-accent"
                      : "border-border bg-card hover:border-ring/50"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-medium leading-tight">
                    {item.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Blue-light glasses conditional */}
        {hasBlueLight && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">
              What color are the lenses?
            </Label>
            <Input
              placeholder="e.g., amber, orange, clear"
              className="mt-1.5 h-12 rounded-xl text-base"
              {...register("blueLightGlassesColor")}
            />
            {errors.blueLightGlassesColor && (
              <p className="mt-1 text-xs text-red-600">
                {errors.blueLightGlassesColor.message}
              </p>
            )}
          </div>
        )}

        {/* Share bed */}
        <div>
          <Label className="text-sm font-medium">
            Do you share a bed with a partner?
          </Label>
          <div className="mt-3 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() =>
                  setValue("sharesBedWithPartner", val, { shouldDirty: true })
                }
                className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                  sharesBed === val
                    ? "border-ring bg-accent text-accent-foreground"
                    : "border-border bg-card text-foreground hover:border-ring/50"
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
          {errors.sharesBedWithPartner && (
            <p className="mt-1 text-xs text-red-600">
              {errors.sharesBedWithPartner.message}
            </p>
          )}
        </div>

        {/* Share blanket conditional */}
        {sharesBed && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">
              Do you share a blanket?
            </Label>
            <div className="mt-3 flex gap-3">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() =>
                    setValue("sharesBlanketWithPartner", val, {
                      shouldDirty: true,
                    })
                  }
                  className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                    watch("sharesBlanketWithPartner") === val
                      ? "border-ring bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:border-ring/50"
                  }`}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bedtime wear */}
        <div>
          <Label className="text-sm font-medium">
            What do you wear to bed?
          </Label>
          <Input
            placeholder="e.g., oversized t-shirt, pajama set, nothing"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("bedtimeWear")}
          />
          {errors.bedtimeWear && (
            <p className="mt-1 text-xs text-red-600">
              {errors.bedtimeWear.message}
            </p>
          )}
        </div>

        {/* Other bedroom uses */}
        <div>
          <Label className="text-sm font-medium">
            Do you use your bedroom for anything besides sleep?
          </Label>
          <Input
            placeholder="e.g., work, TV, meditation, reading"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("bedroomOtherUses")}
          />
          {errors.bedroomOtherUses && (
            <p className="mt-1 text-xs text-red-600">
              {errors.bedroomOtherUses.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add components/form-steps/sleep-setup.tsx
git commit -m "feat: add Section 3 (Sleep Space Setup) with card grid and conditionals"
```

---

## Task 9: Form Step — Section 4 (Sleep Signals)

**Files:**
- Create: `components/form-steps/signals.tsx`

- [ ] **Step 1: Create `components/form-steps/signals.tsx`**

```tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, SweatingShivering } from "@/lib/types";
import { Label } from "@/components/ui/label";

interface SignalsProps {
  form: UseFormReturn<FormData>;
}

const SLEEP_SIGNAL_OPTIONS = [
  { id: "Trouble falling asleep", emoji: "🌙" },
  { id: "Frequent wakeups", emoji: "⏰" },
  { id: "Sleep through but don't feel rested", emoji: "😩" },
  { id: "None of the above", emoji: "✅" },
];

const SWEATING_OPTIONS: { id: SweatingShivering; label: string }[] = [
  { id: "sweating", label: "Sweating" },
  { id: "shivering", label: "Shivering" },
  { id: "both", label: "Both" },
  { id: "no", label: "No" },
];

export function Signals({ form }: SignalsProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const sleepSignals = watch("sleepSignals") || [];
  const sweatingShivering = watch("sweatingShivering");

  function toggleSignal(signal: string) {
    let next: string[];
    if (signal === "None of the above") {
      // Selecting "None" clears all others
      next = sleepSignals.includes(signal) ? [] : [signal];
    } else {
      // Selecting any other option removes "None"
      const withoutNone = sleepSignals.filter(
        (s) => s !== "None of the above"
      );
      next = withoutNone.includes(signal)
        ? withoutNone.filter((s) => s !== signal)
        : [...withoutNone, signal];
    }
    setValue("sleepSignals", next, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Sleep signals
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Help me understand what&apos;s going on with your sleep.
      </p>

      <div className="mt-8 space-y-8">
        {/* Sleep signals — card grid */}
        <div>
          <Label className="text-sm font-medium">
            Which of these apply to you?
          </Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {SLEEP_SIGNAL_OPTIONS.map((option) => {
              const selected = sleepSignals.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleSignal(option.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected
                      ? "border-ring bg-accent"
                      : "border-border bg-card hover:border-ring/50"
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-xs font-medium leading-tight">
                    {option.id}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.sleepSignals && (
            <p className="mt-1 text-xs text-red-600">
              {errors.sleepSignals.message}
            </p>
          )}
        </div>

        {/* Sweating / shivering — pill row */}
        <div>
          <Label className="text-sm font-medium">
            Do you ever wake up sweating or shivering?
          </Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {SWEATING_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  setValue("sweatingShivering", option.id, {
                    shouldDirty: true,
                  })
                }
                className={`rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-colors ${
                  sweatingShivering === option.id
                    ? "border-ring bg-accent text-accent-foreground"
                    : "border-border bg-card text-foreground hover:border-ring/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.sweatingShivering && (
            <p className="mt-1 text-xs text-red-600">
              {errors.sweatingShivering.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add components/form-steps/signals.tsx
git commit -m "feat: add Section 4 (Sleep Signals) with card grid and pill toggles"
```

---

## Task 10: Form Step — Section 5 (Booking + Submit)

**Files:**
- Create: `components/form-steps/booking.tsx`

- [ ] **Step 1: Create `components/form-steps/booking.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingProps {
  calendarUrl: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function Booking({ calendarUrl, isSubmitting, onSubmit }: BookingProps) {
  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Last step — book your free discovery call
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Once you&apos;re booked, your submission comes straight to me.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <iframe
          src={calendarUrl}
          className="h-[500px] w-full border-0"
          title="Book your discovery call"
        />
      </div>

      <div className="mt-6">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full rounded-full bg-foreground py-6 text-base font-semibold text-background hover:bg-foreground/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "I've booked — submit my intake"
          )}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add components/form-steps/booking.tsx
git commit -m "feat: add Section 5 (Booking) with Notion Calendar embed and submit button"
```

---

## Task 11: Main Form Page (Multi-Step Shell)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx` with the multi-step form shell**

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";

import { FormData } from "@/lib/types";
import {
  basicsSchema,
  sleepSetupSchema,
  signalsSchema,
  fullFormSchema,
} from "@/lib/schema";
import { generateSubmissionId } from "@/lib/upload";
import { ProgressBar, SECTION_NAMES } from "@/components/progress-bar";
import { Basics } from "@/components/form-steps/basics";
import { Photos } from "@/components/form-steps/photos";
import { SleepSetup } from "@/components/form-steps/sleep-setup";
import { Signals } from "@/components/form-steps/signals";
import { Booking } from "@/components/form-steps/booking";
import { Button } from "@/components/ui/button";

const TOTAL_STEPS = 5;

// Per-step validation schemas (photos has no required fields)
const STEP_SCHEMAS = [basicsSchema, null, sleepSetupSchema, signalsSchema, null];

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [submissionId] = useState(() => generateSubmissionId());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      photoUrls: {},
      videoUrl: undefined,
      phoneLocation: "",
      itemsOwned: [],
      blueLightGlassesColor: undefined,
      sharesBedWithPartner: undefined as unknown as boolean,
      sharesBlanketWithPartner: undefined,
      bedtimeWear: "",
      bedroomOtherUses: "",
      sleepSignals: [],
      sweatingShivering: undefined as unknown as FormData["sweatingShivering"],
    },
  });

  async function validateCurrentStep(): Promise<boolean> {
    const schema = STEP_SCHEMAS[step];
    if (!schema) return true; // No validation for this step

    const values = form.getValues();
    const result = await schema.safeParseAsync(values);

    if (!result.success) {
      // Trigger RHF errors for the relevant fields
      result.error.errors.forEach((err) => {
        const field = err.path.join(".") as keyof FormData;
        form.setError(field, { message: err.message });
      });
      return false;
    }
    return true;
  }

  async function handleNext() {
    const valid = await validateCurrentStep();
    if (valid && step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  }

  async function handleSubmit() {
    setSubmitError(null);

    // Full validation
    const values = form.getValues();
    const result = fullFormSchema.safeParse(values);
    if (!result.success) {
      setSubmitError("Some required fields are missing. Please go back and check.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, submissionId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      const { id } = await res.json();
      router.push(`/confirmation?name=${encodeURIComponent(values.name)}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const calendarUrl = process.env.NEXT_PUBLIC_NOTION_CALENDAR_URL || "";

  return (
    <main className="min-h-screen bg-background">
      {/* Top navigation bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-sm">
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full bg-foreground/10 p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        <ProgressBar
          currentStep={step + 1}
          totalSteps={TOTAL_STEPS}
          sectionName={SECTION_NAMES[step]}
        />

        <div className="w-9" />
      </div>

      {/* Content area — white card */}
      <div className="mx-auto max-w-lg">
        <div className="min-h-[calc(100vh-8rem)] rounded-t-3xl bg-card shadow-sm">
          {step === 0 && <Basics form={form} />}
          {step === 1 && <Photos form={form} submissionId={submissionId} />}
          {step === 2 && <SleepSetup form={form} />}
          {step === 3 && <Signals form={form} />}
          {step === 4 && (
            <Booking
              calendarUrl={calendarUrl}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>

      {/* Bottom navigation bar (not shown on booking step — it has its own submit button) */}
      {step < 4 && (
        <div className="sticky bottom-0 z-10 border-t border-border bg-card px-4 py-4">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="text-sm font-medium text-foreground underline"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <Button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background hover:bg-foreground/90"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Submit error */}
      {submitError && (
        <div className="fixed bottom-20 left-4 right-4 mx-auto max-w-lg rounded-xl bg-red-50 p-3 text-center text-sm text-red-700 shadow-lg">
          {submitError}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify the dev server starts and the form renders**

```bash
cd /c/Users/yoder/SleepIntake
npm run dev
```

Expected: Form loads at http://localhost:3000 with Section 1 (The Basics) visible, progress pill showing "The Basics . 1 of 5", Next button in the bottom bar.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add app/page.tsx
git commit -m "feat: add multi-step form shell with navigation and step rendering"
```

---

## Task 12: Confirmation Page

**Files:**
- Create: `app/confirmation/page.tsx`

- [ ] **Step 1: Create `app/confirmation/page.tsx`**

```tsx
import { CheckCircle2 } from "lucide-react";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-sm text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-ring" />

        <h1 className="mt-6 text-2xl font-bold text-foreground">
          Thanks{name ? `, ${name}` : ""} — you&apos;re all set.
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          I&apos;ll review your submission and prepare for our call. If anything
          comes up beforehand, reply to the confirmation email.
        </p>

        <p className="mt-6 text-xs text-muted-foreground/60">
          You can close this page now.
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add app/confirmation/page.tsx
git commit -m "feat: add confirmation page"
```

---

## Task 13: Assessment Markdown Generator

**Files:**
- Create: `lib/generate-assessment.ts`

- [ ] **Step 1: Create `lib/generate-assessment.ts`**

Server-side utility that generates the AI-ready markdown document from a submission.

```typescript
import { FullFormData } from "@/lib/schema";

export function generateAssessment(
  data: FullFormData,
  submissionDate: Date
): string {
  const date = submissionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const photoEntries = [
    ["Bed", data.photoUrls?.bed],
    ["Nightstand", data.photoUrls?.nightstand],
    ["Room view", data.photoUrls?.roomView],
    ["Windows", data.photoUrls?.windows],
    ["Living space", data.photoUrls?.livingSpace],
    ["Night lighting", data.photoUrls?.nightLighting],
  ] as const;

  return `# Sleep Assessment: ${data.name}
## Submitted: ${date}

## Sleep Space Setup
- Phone at night: "${data.phoneLocation}"
- Items owned: ${data.itemsOwned.length > 0 ? data.itemsOwned.join(", ") : "None selected"}
- Blue-light glasses color: ${data.blueLightGlassesColor || "N/A"}
- Shares bed: ${data.sharesBedWithPartner ? "Yes" : "No"}
- Shares blanket: ${data.sharesBlanketWithPartner === undefined ? "N/A" : data.sharesBlanketWithPartner ? "Yes" : "No"}
- Bedtime wear: "${data.bedtimeWear}"
- Other bedroom uses: "${data.bedroomOtherUses}"

## Sleep Signals
- Issues: ${data.sleepSignals.join(", ")}
- Sweating/shivering: ${data.sweatingShivering}

## Photos
${photoEntries.map(([label, path]) => `- ${label}: ${path || "Not uploaded"}`).join("\n")}

## Video
- Walkthrough: ${data.videoUrl || "Not uploaded"}
`;
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add lib/generate-assessment.ts
git commit -m "feat: add AI-ready markdown assessment generator"
```

---

## Task 14: Submit API Route

**Files:**
- Create: `app/api/submit/route.ts`

- [ ] **Step 1: Create `app/api/submit/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerSupabase } from "@/lib/supabase-server";
import { fullFormSchema } from "@/lib/schema";
import { generateAssessment } from "@/lib/generate-assessment";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // Parse and validate
  const body = await request.json();
  const { submissionId, ...formFields } = body;
  const result = fullFormSchema.safeParse(formFields);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const data = result.data;
  const supabase = createServerSupabase();
  const now = new Date();

  // 1. Insert submission record
  const { data: submission, error: dbError } = await supabase
    .from("submissions")
    .insert({
      id: submissionId,
      name: data.name,
      email: data.email,
      phone_location: data.phoneLocation,
      items_owned: data.itemsOwned,
      blue_light_glasses_color: data.blueLightGlassesColor || null,
      shares_bed_with_partner: data.sharesBedWithPartner,
      shares_blanket_with_partner: data.sharesBlanketWithPartner ?? null,
      bedtime_wear: data.bedtimeWear,
      bedroom_other_uses: data.bedroomOtherUses,
      sleep_signals: data.sleepSignals,
      sweating_shivering: data.sweatingShivering,
      photo_urls: data.photoUrls || {},
      video_url: data.videoUrl || null,
    })
    .select("id")
    .single();

  if (dbError) {
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }

  // 2. Generate and upload assessment markdown
  const markdown = generateAssessment(data, now);
  const assessmentPath = `${submissionId}/assessment.md`;

  await supabase.storage
    .from("submissions")
    .upload(assessmentPath, new Blob([markdown], { type: "text/markdown" }), {
      contentType: "text/markdown",
      upsert: true,
    });

  // 3. Generate signed URLs for the email (7-day expiry)
  const { data: assessmentUrl } = await supabase.storage
    .from("submissions")
    .createSignedUrl(assessmentPath, 60 * 60 * 24 * 7); // 7 days

  // Build media links
  const mediaLinks: string[] = [];
  if (data.photoUrls) {
    for (const [key, path] of Object.entries(data.photoUrls)) {
      if (path) {
        const { data: url } = await supabase.storage
          .from("submissions")
          .createSignedUrl(path as string, 60 * 60 * 24 * 7);
        if (url) mediaLinks.push(`${key}: ${url.signedUrl}`);
      }
    }
  }
  if (data.videoUrl) {
    const { data: url } = await supabase.storage
      .from("submissions")
      .createSignedUrl(data.videoUrl, 60 * 60 * 24 * 7);
    if (url) mediaLinks.push(`Video: ${url.signedUrl}`);
  }

  // 4. Send email notification (non-blocking — if it fails, submission still succeeds)
  try {
    await resend.emails.send({
      from: "Sleep Intake <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Sleep Assessment: ${data.name}`,
      text: `New submission from ${data.name} (${data.email})
Submitted: ${now.toLocaleString()}

Assessment doc: ${assessmentUrl?.signedUrl || "Error generating link"}

Media:
${mediaLinks.length > 0 ? mediaLinks.join("\n") : "No media uploaded"}`,
    });
  } catch (emailError) {
    // Log but don't fail the submission
    console.error("Failed to send notification email:", emailError);
  }

  return NextResponse.json({ success: true, id: submission.id });
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/Users/yoder/SleepIntake
git add app/api/submit/route.ts
git commit -m "feat: add submit API route (DB insert, markdown gen, email notification)"
```

---

## Task 15: Supabase Setup (Manual Steps)

This task is done by the user in the Supabase dashboard, not by code. Document the exact steps.

- [ ] **Step 1: Create a Supabase project**

Go to https://supabase.com/dashboard and create a new project. Note the project URL and keys.

- [ ] **Step 2: Create the `submissions` table**

In the Supabase SQL Editor, run:

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

- [ ] **Step 3: Create the `submissions` storage bucket**

In the Supabase dashboard, go to Storage and create a new bucket:
- Name: `submissions`
- Public: **No** (private)

- [ ] **Step 4: Add a storage policy for service role uploads**

The service role key bypasses RLS, but for the signed upload URL flow (using the anon key from the browser), add a policy. In the SQL Editor, run:

```sql
create policy "Allow uploads via signed URLs"
  on storage.objects for insert
  to authenticated, anon
  with check (bucket_id = 'submissions');
```

- [ ] **Step 5: Update `.env.local` with real values**

Fill in `.env.local` with the actual Supabase URL, anon key, and service role key from the project settings page. Also set your admin email and Resend API key.

- [ ] **Step 6: Verify connection**

```bash
cd /c/Users/yoder/SleepIntake
npm run dev
```

Open http://localhost:3000, fill in the basics, and click Next. If no errors appear, the Supabase connection is working.

---

## Task 16: End-to-End Test

- [ ] **Step 1: Start the dev server**

```bash
cd /c/Users/yoder/SleepIntake
npm run dev
```

- [ ] **Step 2: Walk through the full form on mobile viewport**

Open Chrome DevTools, set viewport to iPhone 14 (390x844). Walk through all 5 sections:

1. Section 1: Enter name and email, tap Next
2. Section 2: Upload at least one photo, tap Next
3. Section 3: Fill in phone location, select some items, toggle partner question, fill bedtime wear and bedroom uses, tap Next
4. Section 4: Select at least one sleep signal, select a sweating/shivering option, tap Next
5. Section 5: See the Notion Calendar embed (will show your real scheduling page if the URL is configured), tap "I've booked — submit my intake"

- [ ] **Step 3: Verify submission**

After submission:
- You should be redirected to `/confirmation?name=...`
- Check Supabase dashboard: `submissions` table should have a new row
- Check Supabase Storage: `submissions/{id}/` should contain `assessment.md`
- Check your email: should receive the notification with signed links

- [ ] **Step 4: Fix any issues found during testing**

Address any bugs discovered during the walkthrough.

- [ ] **Step 5: Final commit**

```bash
cd /c/Users/yoder/SleepIntake
git add -A
git commit -m "chore: fixes from end-to-end testing"
```

---

## Task 17: Deploy to Vercel

- [ ] **Step 1: Create a GitHub repo**

```bash
cd /c/Users/yoder/SleepIntake
gh repo create SleepIntake --private --source=. --push
```

- [ ] **Step 2: Deploy via Vercel**

Go to https://vercel.com/new, import the `SleepIntake` repo. Vercel will auto-detect Next.js.

- [ ] **Step 3: Set environment variables in Vercel**

In the Vercel project settings, add all variables from `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_NOTION_CALENDAR_URL`

- [ ] **Step 4: Trigger a redeploy**

After setting env vars, trigger a redeploy from the Vercel dashboard (or push a commit).

- [ ] **Step 5: Test the deployed version**

Open the Vercel URL on your phone. Walk through the full form and submit. Verify the email arrives and data is in Supabase.

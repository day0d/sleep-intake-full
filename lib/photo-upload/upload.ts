// Photo upload via signed URLs (alternative to multipart form submission).
// Requires:
//   - /api/upload-url endpoint that returns { signedUrl, token, path }
//   - NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY env vars
//   - A Supabase project with a "submissions" storage bucket
//   - lib/storage/supabase.ts adapter on the server side
//
// To use: call uploadPhoto() per photo blob before form submission,
// then include the returned paths in formData.photoUrls.

import { createClient } from "@supabase/supabase-js";
import { PhotoKey } from "./types";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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

export async function uploadPhoto(
  blob: Blob,
  photoKey: PhotoKey,
  submissionId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  onProgress?.(10);
  const { token, path } = await getSignedUploadUrl(`${photoKey}.jpg`, submissionId);

  onProgress?.(50);
  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from("submissions")
    .uploadToSignedUrl(path, token, blob, { contentType: blob.type });

  if (error) throw new Error(error.message);

  onProgress?.(100);
  return path;
}

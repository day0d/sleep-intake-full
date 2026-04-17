import imageCompression from "browser-image-compression";
import { supabase } from "./supabase-browser";

const IMAGE_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

const VIDEO_MAX_SIZE_MB = 100;

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
  onProgress?.(10);
  const compressed = await imageCompression(file, IMAGE_OPTIONS);

  onProgress?.(30);
  const { signedUrl, token, path } = await getSignedUploadUrl(
    fileName,
    submissionId
  );

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

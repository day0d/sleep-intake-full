import imageCompression from "browser-image-compression";

const IMAGE_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

/** Compress an image file client-side. Returns the compressed Blob. */
export async function compressImage(file: File): Promise<Blob> {
  return imageCompression(file, IMAGE_OPTIONS);
}

export function generateSubmissionId(): string {
  return crypto.randomUUID();
}

import imageCompression from "browser-image-compression";

const IMAGE_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export async function compressImage(file: File): Promise<Blob> {
  return imageCompression(file, IMAGE_OPTIONS);
}

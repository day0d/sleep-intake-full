"use client";

import { PhotoKey } from "../types";
import { FileUpload } from "../file-upload";

interface BedroomPhotosProps {
  photoBlobs: Partial<Record<PhotoKey, Blob>>;
  onPhotoBlob: (key: PhotoKey, blob: Blob | undefined) => void;
}

const PHOTO_FIELDS: { key: PhotoKey; label: string; hint: string }[] = [
  { key: "bed", label: "Your bed", hint: "Wide shot — include the whole bed + surroundings" },
  { key: "nightstand", label: "Your nightstand", hint: "Whatever's next to your bed" },
  { key: "windows", label: "Your windows", hint: "Window coverings as they are right now" },
];

export function BedroomPhotos({ photoBlobs, onPhotoBlob }: BedroomPhotosProps) {
  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Your bedroom</h1>
      <p className="mx-auto mt-2 max-w-xs text-center text-sm text-muted-foreground">
        Take these 3 photos. Don&apos;t clean up — I want to see it as you actually live in it.
      </p>
      <div className="mt-8 space-y-4">
        {PHOTO_FIELDS.map((field) => (
          <FileUpload
            key={field.key}
            label={field.label}
            hint={field.hint}
            hasFile={!!photoBlobs[field.key]}
            onFile={(blob) => onPhotoBlob(field.key, blob)}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { PhotoKey } from "../types";
import { FileUpload } from "../file-upload";

interface LivingSpaceProps {
  photoBlobs: Partial<Record<PhotoKey, Blob>>;
  onPhotoBlob: (key: PhotoKey, blob: Blob | undefined) => void;
}

const PHOTO_FIELDS: { key: PhotoKey; label: string; hint: string }[] = [
  {
    key: "livingSpace1",
    label: "Living space — wide shot",
    hint: "Where you spend your evenings. Show the full room.",
  },
  {
    key: "livingSpace2",
    label: "Living space — screens & lighting",
    hint: "Show your TV, lamps, or any screens you use in the evening",
  },
  {
    key: "livingSpace3",
    label: "Living space — your usual spot",
    hint: "The couch or chair where you typically wind down",
  },
];

export function LivingSpace({ photoBlobs, onPhotoBlob }: LivingSpaceProps) {
  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Your evening space</h1>
      <p className="mx-auto mt-2 max-w-xs text-center text-sm text-muted-foreground">
        Show me where you spend your evenings before bed.
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

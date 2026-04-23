"use client";

import { PhotoKey } from "../types";
import { FileUpload } from "../file-upload";

interface BedroomEnvironmentProps {
  photoBlobs: Partial<Record<PhotoKey, Blob>>;
  onPhotoBlob: (key: PhotoKey, blob: Blob | undefined) => void;
}

const PHOTO_FIELDS: { key: PhotoKey; label: string; hint: string }[] = [
  {
    key: "bedroomLightsOn",
    label: "Bedroom — lights on",
    hint: "Close your blinds, turn on all bedroom lights, and take a wide shot",
  },
  {
    key: "bedroomLightsOff",
    label: "Bedroom — lights off",
    hint: "Same spot, but turn all the lights off. Show how dark it gets.",
  },
];

export function BedroomEnvironment({ photoBlobs, onPhotoBlob }: BedroomEnvironmentProps) {
  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Light check</h1>
      <p className="mx-auto mt-2 max-w-xs text-center text-sm text-muted-foreground">
        Close your blinds and take these two shots from the same spot — one with lights on, one
        with lights off.
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

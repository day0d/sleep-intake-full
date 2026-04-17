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

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
  value?: string;
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

"use client";

import { useRef, useState } from "react";
import { compressImage } from "./compress";
import { Trash2, Camera, Loader2 } from "lucide-react";

interface FileUploadProps {
  label: string;
  hint: string;
  onFile: (blob: Blob | undefined) => void;
  hasFile: boolean;
}

export function FileUpload({ label, hint, onFile, hasFile }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsCompressing(true);

    try {
      const compressed = await compressImage(file);
      const localUrl = URL.createObjectURL(compressed);
      setPreviewUrl(localUrl);
      onFile(compressed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compression failed");
      setPreviewUrl(null);
      onFile(undefined);
    } finally {
      setIsCompressing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onFile(undefined);
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!hasFile && !isCompressing ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center transition-colors hover:border-ring active:bg-muted"
        >
          <Camera className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </button>
      ) : isCompressing ? (
        <div className="w-full rounded-2xl border border-border bg-card p-6 text-center">
          <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Compressing...</p>
        </div>
      ) : (
        <div className="relative w-full rounded-2xl border border-border bg-card overflow-hidden">
          {previewUrl && (
            <img src={previewUrl} alt={label} className="h-40 w-full object-cover" />
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
          <button type="button" onClick={() => inputRef.current?.click()} className="underline">
            Try again
          </button>
        </p>
      )}
    </div>
  );
}

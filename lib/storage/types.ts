/**
 * Shared interface for storage backends.
 * Both Supabase and Google Drive adapters implement this.
 */
export interface StorageAdapter {
  /** Create a submission folder, return an identifier (folder ID or path) */
  createSubmissionFolder(folderName: string): Promise<string>;

  /** Upload a file to the submission folder, return a file identifier */
  uploadFile(
    folderId: string,
    fileName: string,
    data: Buffer,
    mimeType: string
  ): Promise<string>;

  /** Upload the assessment markdown to the submission folder */
  uploadAssessment(
    folderId: string,
    fileName: string,
    markdown: string
  ): Promise<string>;

  /** Get a shareable/viewable URL for a file */
  getFileUrl(fileId: string): Promise<string>;

  /** Get a shareable/viewable URL for the submission folder */
  getFolderUrl(folderId: string): Promise<string>;
}

// ── Naming helpers ──────────────────────────────────────────────────

/** Convert a full name to a URL/file-safe slug: "John Doe" → "John-Doe" */
export function slugifyName(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

/** Build the submission folder name: "2026-04-18 - John Doe - Sleep Intake - 1745612345678"
 *  The trailing timestamp (ms epoch) guarantees uniqueness even if the same
 *  name is submitted more than once on the same day.
 */
export function buildFolderName(name: string, date: Date): string {
  const dateStr = date.toISOString().split("T")[0];
  const uid = date.getTime();
  return `${dateStr} - ${name.trim()} - Sleep Intake - ${uid}`;
}

/** Build a photo file name: "John-Doe_bed.jpg" */
export function buildPhotoFileName(name: string, photoKey: string): string {
  const slug = slugifyName(name);
  return `${slug}_${photoKey}.jpg`;
}

/** Build the assessment file name: "John-Doe_sleep-intake-results_2026-04-18_1745612345678.md" */
export function buildAssessmentFileName(name: string, date: Date): string {
  const slug = slugifyName(name);
  const dateStr = date.toISOString().split("T")[0];
  const uid = date.getTime();
  return `${slug}_sleep-intake-results_${dateStr}_${uid}.md`;
}

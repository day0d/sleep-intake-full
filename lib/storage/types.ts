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

// ── Full Intake Client naming ────────────────────────────────────────

/** Build the full intake folder name: "2026-04-18 - John Doe - Full Intake Client - 1745612345678" */
export function buildFolderName(name: string, date: Date): string {
  const dateStr = date.toISOString().split("T")[0];
  const uid = date.getTime();
  return dateStr + " - " + name.trim() + " - Full Intake Client - " + uid;
}

/** Build a photo file name: "John-Doe_bed.jpg" */
export function buildPhotoFileName(name: string, photoKey: string): string {
  const slug = slugifyName(name);
  return slug + "_" + photoKey + ".jpg";
}

/** Build the full intake assessment file name: "John-Doe_full-intake-results_2026-04-18_1745612345678.md" */
export function buildAssessmentFileName(name: string, date: Date): string {
  const slug = slugifyName(name);
  const dateStr = date.toISOString().split("T")[0];
  const uid = date.getTime();
  return slug + "_full-intake-results_" + dateStr + "_" + uid + ".md";
}

// ── Lead Survey (Pre-Strategy Session) naming ────────────────────────

/** Build the lead survey folder name: "2026-04-18 - John Doe - Lead Survey - 1745612345678" */
export function buildLeadSurveyFolderName(name: string, date: Date): string {
  const dateStr = date.toISOString().split("T")[0];
  const uid = date.getTime();
  return dateStr + " - " + name.trim() + " - Lead Survey - " + uid;
}

/** Build the lead survey assessment file name: "John-Doe_lead-survey-results_2026-04-18_1745612345678.md" */
export function buildLeadSurveyAssessmentFileName(name: string, date: Date): string {
  const slug = slugifyName(name);
  const dateStr = date.toISOString().split("T")[0];
  const uid = date.getTime();
  return slug + "_lead-survey-results_" + dateStr + "_" + uid + ".md";
}

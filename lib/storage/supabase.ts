import { createServerSupabase } from "@/lib/supabase-server";
import type { StorageAdapter } from "./types";

const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 7; // 7 days
const BUCKET = "submissions";

export class SupabaseStorageAdapter implements StorageAdapter {
  private supabase = createServerSupabase();

  async createSubmissionFolder(folderName: string): Promise<string> {
    // Supabase Storage uses flat paths, no explicit folder creation.
    // The folder name becomes a path prefix.
    return folderName;
  }

  async uploadFile(
    folderId: string,
    fileName: string,
    data: Buffer,
    mimeType: string
  ): Promise<string> {
    const path = `${folderId}/${fileName}`;
    const { error } = await this.supabase.storage
      .from(BUCKET)
      .upload(path, data, { contentType: mimeType, upsert: true });

    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
    return path;
  }

  async uploadAssessment(
    folderId: string,
    fileName: string,
    markdown: string
  ): Promise<string> {
    const path = `${folderId}/${fileName}`;
    const { error } = await this.supabase.storage
      .from(BUCKET)
      .upload(path, new Blob([markdown], { type: "text/markdown" }), {
        contentType: "text/markdown",
        upsert: true,
      });

    if (error) throw new Error(`Supabase assessment upload failed: ${error.message}`);
    return path;
  }

  async getFileUrl(fileId: string): Promise<string> {
    const { data } = await this.supabase.storage
      .from(BUCKET)
      .createSignedUrl(fileId, SIGNED_URL_EXPIRY);

    return data?.signedUrl || "";
  }

  async getFolderUrl(folderId: string): Promise<string> {
    // Supabase doesn't have folder-level URLs. Return a descriptive string.
    return `Supabase Storage: ${BUCKET}/${folderId}/`;
  }
}

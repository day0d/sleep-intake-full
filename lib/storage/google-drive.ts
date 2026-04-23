import { google } from "googleapis";
import { Readable } from "stream";
import type { StorageAdapter } from "./types";

function getAuthClient() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY env var is not set");

  const key = JSON.parse(keyJson);
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
}

function getParentFolderId(): string {
  const id = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!id) throw new Error("GOOGLE_DRIVE_FOLDER_ID env var is not set");
  return id;
}

export class GoogleDriveStorageAdapter implements StorageAdapter {
  private auth = getAuthClient();
  private drive = google.drive({ version: "v3", auth: this.auth });
  private parentFolderId = getParentFolderId();

  /** Folder ID cache: folderName → Drive folder ID */
  private folderCache = new Map<string, string>();

  async createSubmissionFolder(folderName: string): Promise<string> {
    const cached = this.folderCache.get(folderName);
    if (cached) return cached;

    const res = await this.drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [this.parentFolderId],
      },
      fields: "id",
    });

    const folderId = res.data.id!;
    this.folderCache.set(folderName, folderId);

    // Make the folder viewable via link
    await this.drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return folderId;
  }

  async uploadFile(
    folderId: string,
    fileName: string,
    data: Buffer,
    mimeType: string
  ): Promise<string> {
    const res = await this.drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: Readable.from(data),
      },
      fields: "id",
    });

    const fileId = res.data.id!;

    // Make the file viewable via link
    await this.drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return fileId;
  }

  async uploadAssessment(
    folderId: string,
    fileName: string,
    markdown: string
  ): Promise<string> {
    return this.uploadFile(
      folderId,
      fileName,
      Buffer.from(markdown, "utf-8"),
      "text/markdown"
    );
  }

  async getFileUrl(fileId: string): Promise<string> {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }

  async getFolderUrl(folderId: string): Promise<string> {
    return `https://drive.google.com/drive/folders/${folderId}`;
  }
}

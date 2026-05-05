import type { StorageAdapter } from "./types";

export type { StorageAdapter } from "./types";
export {
  slugifyName,
  buildFolderName,
  buildPhotoFileName,
  buildAssessmentFileName,
  buildLeadSurveyFolderName,
  buildLeadSurveyAssessmentFileName,
} from "./types";

let cachedAdapter: StorageAdapter | null = null;

export function getStorageAdapter(): StorageAdapter {
  if (cachedAdapter) return cachedAdapter;

  const provider = process.env.STORAGE_PROVIDER || "supabase";

  switch (provider) {
    case "google-drive": {
      const { GoogleDriveStorageAdapter } = require("./google-drive");
      cachedAdapter = new GoogleDriveStorageAdapter();
      break;
    }
    case "supabase": {
      const { SupabaseStorageAdapter } = require("./supabase");
      cachedAdapter = new SupabaseStorageAdapter();
      break;
    }
    default:
      throw new Error(
        "Unknown STORAGE_PROVIDER: " + JSON.stringify(provider) + ". Use supabase or google-drive."
      );
  }

  return cachedAdapter!;
}

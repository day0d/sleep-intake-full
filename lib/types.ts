export type PhotoKey =
  | "bed"
  | "nightstand"
  | "roomView"
  | "windows"
  | "livingSpace"
  | "nightLighting";

export type SweatingShivering = "sweating" | "shivering" | "both" | "no";

export interface FormData {
  // Section 1
  name: string;
  email: string;
  // Section 2
  photoUrls: Partial<Record<PhotoKey, string>>;
  videoUrl?: string;
  // Section 3
  phoneLocation: string;
  itemsOwned: string[];
  blueLightGlassesColor?: string;
  sharesBedWithPartner: boolean;
  sharesBlanketWithPartner?: boolean;
  bedtimeWear: string;
  bedroomOtherUses: string;
  // Section 4
  sleepSignals: string[];
  sweatingShivering: SweatingShivering;
}

export interface SubmissionResponse {
  success: boolean;
  id: string;
}

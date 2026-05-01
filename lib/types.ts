export type Variance = "consistent" | "some" | "a_lot";
export type TimeVariance = "30min" | "1h" | "2h" | ">2h";
export type SleepAmount = "<5" | "5-6" | "6-7" | "7-8" | "8-9" | "9+";
export type BedroomTemp = "<65" | "65-68" | "68-72" | ">72" | "unsure";

export type CurtainType =
  | "none"
  | "no_windows"
  | "blinds"
  | "solid_shades"
  | "fabric_panels"
  | "film_tint"
  | "shutters";

export type CoveringOpacity =
  | "sheer"
  | "light_filtering"
  | "room_darkening"
  | "blackout";

export type NoiseSource =
  | "hvac_fridge"
  | "street_traffic"
  | "animals"
  | "partner"
  | "tv_devices"
  | "other";
export type NoiseFrequency = "rarely" | "sometimes" | "often";

export type BedFirmness = "bouncy" | "contouring" | "buoyant" | "firm";
export type BedSize = "twin" | "full" | "queen" | "king" | "cali_king";
export type MattressType = "memory_foam" | "innerspring" | "latex" | "hybrid";
export type FrameSupport = "wooden_slats" | "metal_grid" | "box_springs";
export type SheetType = "cotton" | "bamboo_tencel" | "polyester_microfiber" | "linen" | "silk";

export type PmPhoneWindow = "in_bed" | "30m" | "1h" | "2h+" | "not_sure";

export type AmSunExposure = "none" | "<15m" | "15-30m" | "30-60m" | "1-2h" | "later";
export type AmSunDuration = "<2m" | "3-5m" | "5-10m" | "10-15m" | "15+m";

export type AmPhoneWindow =
  | "in_bed"
  | "within_15m"
  | "30m-1h"
  | "after_breakfast"
  | "later";

export type FirstSocialWindow =
  | "<15m"
  | "15-30m"
  | "30-60m"
  | "1-2h"
  | "2-4h"
  | "4h+"
  | "varies";

export type ExerciseFrequency = "0" | "1-2" | "3-4" | "5-6" | "7";
export type ExerciseTiming = "morning" | "midday" | "late_afternoon" | "evening" | "varies";

export type WakeupType =
  | "pain"
  | "restlessness"
  | "mental_anxiety"
  | "somatic_anxiety"
  | "partner_environmental"
  | "overheating"
  | "cold"
  | "vivid_dreams"
  | "frequent_urination"
  | "other";

export interface FoodLogEntry {
  items: string;
  mealType: string;
  time?: string;
  location: string;
}

export interface SupplementEntry {
  name: string;
  dosage: string;
}

export interface FormData {
  // Step 1: Basics
  name: string;
  email: string;

  // Step 2: Sleep Schedule
  bedtime?: string;
  bedtimeVariance?: TimeVariance;
  wakeTime?: string;
  wakeTimeVariance?: TimeVariance;
  sleepWakeVariance?: Variance; // kept for backwards compat
  sleepAmount?: SleepAmount;
  sleepAmountVariance?: Variance;
  naturalBedtime?: string;
  naturalWakeTime?: string;

  // Step 3: Sleep Quality
  sleepSignals: string[];
  sleepPatterns: string[];
  wakeupTypology: WakeupType[];
  wakeupOther?: string;
  lyingAwakeState: string[];

  // Step 4: Your Bedroom
  phoneBroughtToRoom?: boolean;
  phoneAppsAm?: string;
  phoneAppsPm?: string;
  itemsOwned: string[];
  blueLightGlassesColor: string[];
  bedSharers: string[];
  sharesBedWithPartner?: boolean; // kept for backwards compat
  sharesBlanketWithPartner?: boolean;
  bedroomOtherUses: string;
  nighttimeTemp?: BedroomTemp;
  curtainTypes: CurtainType[];
  curtainOpacity?: CoveringOpacity;
  noiseSources: NoiseSource[];
  noiseFrequency: Partial<Record<NoiseSource, NoiseFrequency>>;
  noiseOther?: string;
  // Bed features
  bedFirmness?: BedFirmness;
  hasMattressSag?: boolean;
  bedSize?: BedSize;
  mattressType?: MattressType;
  frameSupport?: FrameSupport;
  bedAssociations?: string;
  sheetType?: SheetType;

  // Step 5: Evening Habits
  pmRoutine?: string;
  pmPhoneWindow?: PmPhoneWindow;
  eveningLightLocation: string[];
  eveningLightTone: string[];
  eveningLightIntensity?: string;
  eveningDeviceScreen: string[]; // kept for backwards compat
  eveningScreenTypes: string[];
  eveningScreenDimmers: string[];

  // Step 6: Morning Habits
  amRoutine?: string;
  amSunExposure?: AmSunExposure;
  amSunDuration?: AmSunDuration;
  amSunVariance?: Variance;
  amPhoneWindow?: AmPhoneWindow;
  firstSocialWindow?: FirstSocialWindow;

  // Step 7: Food & Drink
  foodLog: FoodLogEntry[];
  firstMealTime?: string;
  lastMealTime?: string;
  caffeineSources: string[];
  caffeineSourceOther?: string;
  firstCaffeineTime?: string;
  lastCaffeineTime?: string;
  waterAdditions: string[];
  waterAdditionOther?: string;
  alcoholLast3Days?: boolean;
  alcoholEveningPattern?: boolean;
  hasLowNutrientHistory?: boolean;
  lowNutrientHistoryDetails?: string;
  supplements: SupplementEntry[];
  medications?: string;

  // Step 8: Movement
  exerciseTypes: string[];
  exerciseFrequency?: ExerciseFrequency;
  exerciseFrequencyVariance?: Variance;
  exerciseTiming: ExerciseTiming[];
  exerciseTimingVariance?: Variance;
  exerciseRecoverySymptoms: string[];
}

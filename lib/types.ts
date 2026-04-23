export type Variance = "consistent" | "some" | "a_lot";
export type SleepAmount = "<5" | "5-6" | "6-7" | "7-8" | "8-9" | "9+";
export type BedroomTemp = "<65" | "65-68" | "68-72" | ">72" | "unsure";

export type CurtainType =
  | "none"
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
  | "tv_devices";
export type NoiseFrequency = "rarely" | "sometimes" | "often";

export type PmPhoneWindow = "in_bed" | "30m" | "1h" | "2h+" | "not_sure";

export type AmSunExposure = "none" | "<15m" | "15-30m" | "30-60m" | "1-2h" | "later";

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

export type DietType =
  | "standard"
  | "mediterranean"
  | "low_carb"
  | "keto"
  | "carnivore"
  | "vegetarian"
  | "vegan"
  | "paleo"
  | "intermittent_fasting"
  | "none";

export type CaffeineVolume = "none" | "1_cup" | "2_3_cups" | "4_plus";
export type ExerciseFrequency = "0" | "1-2" | "3-4" | "5-6" | "7";
export type ExerciseTiming = "am" | "midday" | "pm" | "evening" | "varies";
export type Recovery = "great" | "ok" | "struggling";

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

export interface FormData {
  // Step 1: Basics
  name: string;
  email: string;

  // Step 2: Sleep Schedule
  bedtime?: string;
  wakeTime?: string;
  sleepWakeVariance?: Variance;
  sleepAmount?: SleepAmount;
  sleepAmountVariance?: Variance;
  naturalBedtime?: string;
  naturalWakeTime?: string;

  // Step 3: Sleep Quality
  sleepSignals: string[];
  wakeupTypology: WakeupType[];
  wakeupOther?: string;
  lyingAwakeState: string[];

  // Step 4: Your Bedroom
  phoneBroughtToRoom?: boolean;
  itemsOwned: string[];
  blueLightGlassesColor?: string;
  sharesBedWithPartner?: boolean;
  sharesBlanketWithPartner?: boolean;
  bedroomOtherUses: string;
  nighttimeTemp?: BedroomTemp;
  curtainTypes: CurtainType[];
  curtainOpacity?: CoveringOpacity;
  noiseSources: NoiseSource[];
  noiseFrequency: Partial<Record<NoiseSource, NoiseFrequency>>;

  // Step 5: Evening Habits
  pmRoutine?: string;
  pmPhoneWindow?: PmPhoneWindow;
  eveningLightLocation: string[];
  eveningLightTone: string[];
  eveningLightIntensity?: string;
  eveningDeviceScreen: string[];

  // Step 6: Morning Habits
  amRoutine?: string;
  amSunExposure?: AmSunExposure;
  amSunVariance?: Variance;
  amPhoneWindow?: AmPhoneWindow;
  firstSocialWindow?: FirstSocialWindow;

  // Step 7: Food & Drink
  dietType?: DietType;
  metabolicSymptoms: string[];
  firstMealTime?: string;
  firstMealVariance?: Variance;
  lastMealTime?: string;
  lastMealVariance?: Variance;
  firstCaffeineTime?: string;
  lastCaffeineTime?: string;
  caffeineVolume?: CaffeineVolume;
  electrolyteHabits: string[];
  electrolyteSymptoms: string[];

  // Step 8: Movement
  exerciseTypes: string[];
  exerciseFrequency?: ExerciseFrequency;
  exerciseFrequencyVariance?: Variance;
  exerciseTiming?: ExerciseTiming;
  exerciseTimingVariance?: Variance;
  recovery?: Recovery;

  // Step 9: Body Signals
  inflammationSymptoms: string[];
  supplementsMeds?: string;
}

export interface SubmissionResponse {
  success: boolean;
  id: string;
}

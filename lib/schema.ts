import { z } from "zod";

const variance = z.enum(["consistent", "some", "a_lot"]);
const timeVariance = z.enum(["30min", "1h", "2h", ">2h"]);

// Step 1 — required
export const basicsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
});

// Step 2 — Sleep Schedule (all optional)
export const sleepScheduleSchema = z.object({
  bedtime: z.string().optional(),
  bedtimeVariance: timeVariance.optional(),
  wakeTime: z.string().optional(),
  wakeTimeVariance: timeVariance.optional(),
  sleepWakeVariance: variance.optional(), // kept for backwards compat
  sleepAmount: z.enum(["<5", "5-6", "6-7", "7-8", "8-9", "9+"]).optional(),
  sleepAmountVariance: variance.optional(),
  naturalBedtime: z.string().optional(),
  naturalWakeTime: z.string().optional(),
});

// Step 3 — Sleep Quality
export const sleepQualitySchema = z.object({
  sleepSignals: z.array(z.string()).default([]),
  sleepPatterns: z.array(z.string()).default([]),
  wakeupTypology: z
    .array(
      z.enum([
        "pain",
        "restlessness",
        "mental_anxiety",
        "somatic_anxiety",
        "partner_environmental",
        "overheating",
        "cold",
        "vivid_dreams",
        "frequent_urination",
        "other",
      ])
    )
    .default([]),
  wakeupOther: z.string().optional(),
  lyingAwakeState: z.array(z.string()).default([]),
});

// Step 4 — Your Bedroom
export const bedroomSchema = z.object({
  phoneBroughtToRoom: z.boolean().optional(),
  phoneAppsAm: z.string().optional(),
  phoneAppsPm: z.string().optional(),
  itemsOwned: z.array(z.string()).default([]),
  blueLightGlassesColor: z.array(z.string()).default([]),
  bedSharers: z.array(z.string()).default([]),
  sharesBedWithPartner: z.boolean().optional(), // kept for backwards compat
  sharesBlanketWithPartner: z.boolean().optional(),
  bedroomOtherUses: z.string().optional(),
  nighttimeTemp: z.enum(["<65", "65-68", "68-72", ">72", "unsure"]).optional(),
  curtainTypes: z
    .array(z.enum(["none", "no_windows", "blinds", "solid_shades", "fabric_panels", "film_tint", "shutters"]))
    .default([]),
  curtainOpacity: z
    .enum(["sheer", "light_filtering", "room_darkening", "blackout"])
    .optional(),
  noiseSources: z
    .array(z.enum(["hvac_fridge", "street_traffic", "animals", "partner", "tv_devices", "other"]))
    .default([]),
  noiseFrequency: z
    .record(z.string(), z.enum(["rarely", "sometimes", "often"]))
    .default({}),
  noiseOther: z.string().optional(),
  // Bed features
  bedFirmness: z.enum(["bouncy", "contouring", "buoyant", "firm"]).optional(),
  hasMattressSag: z.boolean().optional(),
  bedSize: z.enum(["twin", "full", "queen", "king", "cali_king"]).optional(),
  mattressType: z.enum(["memory_foam", "innerspring", "latex", "hybrid"]).optional(),
  frameSupport: z.enum(["wooden_slats", "metal_grid", "box_springs"]).optional(),
  bedAssociations: z.string().optional(),
  sheetType: z.enum(["cotton", "bamboo_tencel", "polyester_microfiber", "linen", "silk"]).optional(),
});

// Step 5 — Evening Habits
export const eveningHabitsSchema = z.object({
  pmRoutine: z.string().optional(),
  pmPhoneWindow: z.enum(["in_bed", "30m", "1h", "2h+", "not_sure"]).optional(),
  eveningLightLocation: z.array(z.string()).default([]),
  eveningLightTone: z.array(z.string()).default([]),
  eveningLightIntensity: z.string().optional(),
  eveningDeviceScreen: z.array(z.string()).default([]), // kept for backwards compat
  eveningScreenTypes: z.array(z.string()).default([]),
  eveningScreenDimmers: z.array(z.string()).default([]),
});

// Step 6 — Morning Habits
export const morningHabitsSchema = z.object({
  amRoutine: z.string().optional(),
  amSunExposure: z
    .enum(["none", "<15m", "15-30m", "30-60m", "1-2h", "later"])
    .optional(),
  amSunDuration: z
    .enum(["<2m", "3-5m", "5-10m", "10-15m", "15+m"])
    .optional(),
  amSunVariance: variance.optional(),
  amPhoneWindow: z
    .enum(["in_bed", "within_15m", "30m-1h", "after_breakfast", "later"])
    .optional(),
  firstSocialWindow: z
    .enum(["<15m", "15-30m", "30-60m", "1-2h", "2-4h", "4h+", "varies"])
    .optional(),
});

// Step 7 — Food & Drink
export const foodDrinkSchema = z.object({
  foodLog: z
    .array(
      z.object({
        items: z.string().default(""),
        mealType: z.string().default(""),
        time: z.string().optional(),
        location: z.string().default(""),
      })
    )
    .default([]),
  firstMealTime: z.string().optional(),
  lastMealTime: z.string().optional(),
  caffeineSources: z.array(z.string()).default([]),
  caffeineSourceOther: z.string().optional(),
  firstCaffeineTime: z.string().optional(),
  lastCaffeineTime: z.string().optional(),
  waterAdditions: z.array(z.string()).default([]),
  waterAdditionOther: z.string().optional(),
  alcoholLast3Days: z.boolean().optional(),
  alcoholEveningPattern: z.boolean().optional(),
  hasLowNutrientHistory: z.boolean().optional(),
  lowNutrientHistoryDetails: z.string().optional(),
  supplements: z
    .array(
      z.object({
        name: z.string().default(""),
        dosage: z.string().default(""),
      })
    )
    .default([]),
  medications: z.string().optional(),
});

// Step 8 — Movement
export const movementSchema = z.object({
  exerciseTypes: z.array(z.string()).default([]),
  exerciseFrequency: z.enum(["0", "1-2", "3-4", "5-6", "7"]).optional(),
  exerciseFrequencyVariance: variance.optional(),
  exerciseTiming: z
    .array(z.enum(["morning", "midday", "late_afternoon", "evening", "varies"]))
    .default([]),
  exerciseTimingVariance: variance.optional(),
  exerciseRecoverySymptoms: z.array(z.string()).default([]),
});

export const fullFormSchema = basicsSchema
  .merge(sleepScheduleSchema)
  .merge(sleepQualitySchema)
  .merge(bedroomSchema)
  .merge(eveningHabitsSchema)
  .merge(morningHabitsSchema)
  .merge(foodDrinkSchema)
  .merge(movementSchema);

export type FullFormData = z.infer<typeof fullFormSchema>;

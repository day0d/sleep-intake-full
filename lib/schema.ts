import { z } from "zod";

const variance = z.enum(["consistent", "some", "a_lot"]);

// Step 1 — required
export const basicsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
});

// Step 2 — Sleep Schedule (all optional)
export const sleepScheduleSchema = z.object({
  bedtime: z.string().optional(),
  wakeTime: z.string().optional(),
  sleepWakeVariance: variance.optional(),
  sleepAmount: z.enum(["<5", "5-6", "6-7", "7-8", "8-9", "9+"]).optional(),
  sleepAmountVariance: variance.optional(),
  naturalBedtime: z.string().optional(),
  naturalWakeTime: z.string().optional(),
});

// Step 3 — Sleep Quality
export const sleepQualitySchema = z.object({
  sleepSignals: z.array(z.string()).default([]),
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
  itemsOwned: z.array(z.string()).default([]),
  blueLightGlassesColor: z.string().optional(),
  sharesBedWithPartner: z.boolean().optional(),
  sharesBlanketWithPartner: z.boolean().optional(),
  bedroomOtherUses: z.string().optional(),
  nighttimeTemp: z
    .enum(["<65", "65-68", "68-72", ">72", "unsure"])
    .optional(),
  curtainTypes: z
    .array(
      z.enum(["none", "blinds", "solid_shades", "fabric_panels", "film_tint", "shutters"])
    )
    .default([]),
  curtainOpacity: z
    .enum(["sheer", "light_filtering", "room_darkening", "blackout"])
    .optional(),
  noiseSources: z
    .array(
      z.enum([
        "hvac_fridge",
        "street_traffic",
        "animals",
        "partner",
        "tv_devices",
      ])
    )
    .default([]),
  noiseFrequency: z
    .record(z.string(), z.enum(["rarely", "sometimes", "often"]))
    .default({}),
});

// Step 5 — Evening Habits
export const eveningHabitsSchema = z.object({
  pmRoutine: z.string().optional(),
  pmPhoneWindow: z
    .enum(["in_bed", "30m", "1h", "2h+", "not_sure"])
    .optional(),
  eveningLightLocation: z.array(z.string()).default([]),
  eveningLightTone: z.array(z.string()).default([]),
  eveningLightIntensity: z.string().optional(),
  eveningDeviceScreen: z.array(z.string()).default([]),
});

// Step 6 — Morning Habits
export const morningHabitsSchema = z.object({
  amRoutine: z.string().optional(),
  amSunExposure: z
    .enum(["none", "<15m", "15-30m", "30-60m", "1-2h", "later"])
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
  dietType: z
    .enum([
      "standard",
      "mediterranean",
      "low_carb",
      "keto",
      "carnivore",
      "vegetarian",
      "vegan",
      "paleo",
      "intermittent_fasting",
      "none",
    ])
    .optional(),
  metabolicSymptoms: z.array(z.string()).default([]),
  firstMealTime: z.string().optional(),
  firstMealVariance: variance.optional(),
  lastMealTime: z.string().optional(),
  lastMealVariance: variance.optional(),
  firstCaffeineTime: z.string().optional(),
  lastCaffeineTime: z.string().optional(),
  caffeineVolume: z.enum(["none", "1_cup", "2_3_cups", "4_plus"]).optional(),
  electrolyteHabits: z.array(z.string()).default([]),
  electrolyteSymptoms: z.array(z.string()).default([]),
});

// Step 8 — Movement
export const movementSchema = z.object({
  exerciseTypes: z.array(z.string()).default([]),
  exerciseFrequency: z.enum(["0", "1-2", "3-4", "5-6", "7"]).optional(),
  exerciseFrequencyVariance: variance.optional(),
  exerciseTiming: z
    .enum(["am", "midday", "pm", "evening", "varies"])
    .optional(),
  exerciseTimingVariance: variance.optional(),
  recovery: z.enum(["great", "ok", "struggling"]).optional(),
});

// Step 9 — Body Signals
export const bodySignalsSchema = z.object({
  inflammationSymptoms: z.array(z.string()).default([]),
  supplementsMeds: z.string().optional(),
});

export const fullFormSchema = basicsSchema
  .merge(sleepScheduleSchema)
  .merge(sleepQualitySchema)
  .merge(bedroomSchema)
  .merge(eveningHabitsSchema)
  .merge(morningHabitsSchema)
  .merge(foodDrinkSchema)
  .merge(movementSchema)
  .merge(bodySignalsSchema);

export type FullFormData = z.infer<typeof fullFormSchema>;

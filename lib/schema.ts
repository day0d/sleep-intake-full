import { z } from "zod";

// Section 1
export const basicsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
});

// Section 2 — all optional
export const photosSchema = z.object({
  photoUrls: z.object({
    bed: z.string().url().optional(),
    nightstand: z.string().url().optional(),
    roomView: z.string().url().optional(),
    windows: z.string().url().optional(),
    livingSpace: z.string().url().optional(),
    nightLighting: z.string().url().optional(),
  }),
  videoUrl: z.string().url().optional(),
});

// Section 3
export const sleepSetupSchema = z
  .object({
    phoneLocation: z.string().min(1, "Please tell us where you put your phone"),
    itemsOwned: z.array(z.string()).default([]),
    blueLightGlassesColor: z.string().optional(),
    sharesBedWithPartner: z.boolean({ error: "Please select yes or no" }),
    sharesBlanketWithPartner: z.boolean().optional(),
    bedtimeWear: z.string().min(1, "Please tell us what you wear to bed"),
    bedroomOtherUses: z.string().min(1, "Please tell us how else you use your bedroom"),
  })
  .refine(
    (data) => {
      if (data.itemsOwned.includes("Blue-light blocking glasses")) {
        return !!data.blueLightGlassesColor;
      }
      return true;
    },
    {
      message: "Please tell us the lens color",
      path: ["blueLightGlassesColor"],
    }
  )
  .refine(
    (data) => {
      if (data.sharesBedWithPartner) {
        return data.sharesBlanketWithPartner !== undefined;
      }
      return true;
    },
    {
      message: "Please select yes or no",
      path: ["sharesBlanketWithPartner"],
    }
  );

// Section 4
export const signalsSchema = z.object({
  sleepSignals: z
    .array(z.string())
    .min(1, "Please select at least one option"),
  sweatingShivering: z.enum(["sweating", "shivering", "both", "no"], {
    error: "Please select an option",
  }),
});

// Full form (used on final submit)
export const fullFormSchema = basicsSchema
  .merge(photosSchema)
  .merge(
    z.object({
      phoneLocation: z.string().min(1),
      itemsOwned: z.array(z.string()).default([]),
      blueLightGlassesColor: z.string().optional(),
      sharesBedWithPartner: z.boolean(),
      sharesBlanketWithPartner: z.boolean().optional(),
      bedtimeWear: z.string().min(1),
      bedroomOtherUses: z.string().min(1),
      sleepSignals: z.array(z.string()).min(1),
      sweatingShivering: z.enum(["sweating", "shivering", "both", "no"]),
    })
  );

export type FullFormData = z.infer<typeof fullFormSchema>;

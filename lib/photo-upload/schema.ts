import { z } from "zod";

export const photosSchema = z.object({
  photoUrls: z.object({
    bed: z.string().optional(),
    nightstand: z.string().optional(),
    windows: z.string().optional(),
    bedroomLightsOn: z.string().optional(),
    bedroomLightsOff: z.string().optional(),
    livingSpace1: z.string().optional(),
    livingSpace2: z.string().optional(),
    livingSpace3: z.string().optional(),
  }),
});

export type PhotoUrls = z.infer<typeof photosSchema>["photoUrls"];

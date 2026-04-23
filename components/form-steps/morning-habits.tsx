"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, AmSunExposure, AmPhoneWindow, FirstSocialWindow, Variance } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PillRow } from "@/components/ui/pill-row";
import { VariancePills } from "@/components/ui/variance-pills";

interface MorningHabitsProps {
  form: UseFormReturn<FormData>;
}

const SUN_EXPOSURE_OPTIONS: { id: AmSunExposure; label: string }[] = [
  { id: "none", label: "I don't" },
  { id: "<15m", label: "<15m" },
  { id: "15-30m", label: "15–30m" },
  { id: "30-60m", label: "30–60m" },
  { id: "1-2h", label: "1–2h" },
  { id: "later", label: "Later in day" },
];

const AM_PHONE_OPTIONS: { id: AmPhoneWindow; label: string }[] = [
  { id: "in_bed", label: "In bed" },
  { id: "within_15m", label: "Within 15m" },
  { id: "30m-1h", label: "30m–1h" },
  { id: "after_breakfast", label: "After breakfast" },
  { id: "later", label: "Later" },
];

const SOCIAL_OPTIONS: { id: FirstSocialWindow; label: string }[] = [
  { id: "<15m", label: "<15m" },
  { id: "15-30m", label: "15–30m" },
  { id: "30-60m", label: "30–60m" },
  { id: "1-2h", label: "1–2h" },
  { id: "2-4h", label: "2–4h" },
  { id: "4h+", label: "4h+" },
  { id: "varies", label: "Varies" },
];

export function MorningHabits({ form }: MorningHabitsProps) {
  const { register, setValue, watch } = form;

  const amSunExposure = watch("amSunExposure");
  const amSunVariance = watch("amSunVariance");
  const amPhoneWindow = watch("amPhoneWindow");
  const firstSocialWindow = watch("firstSocialWindow");

  const hasSunlight = amSunExposure && amSunExposure !== "none";

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Morning habits</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Routines, light, and the first few hours of the day.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <Label className="text-sm font-medium">Describe your morning routine</Label>
          <div className="mt-1.5">
            <Textarea
              placeholder="e.g., alarm → coffee → walk → shower → commute"
              {...register("amRoutine")}
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            How soon after waking do you get direct sunlight?
          </Label>
          <div className="mt-3">
            <PillRow
              options={SUN_EXPOSURE_OPTIONS}
              value={amSunExposure}
              onChange={(v) =>
                setValue("amSunExposure", v as AmSunExposure | undefined, { shouldDirty: true })
              }
            />
          </div>

          {hasSunlight && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
              <Label className="text-sm font-medium">How consistent is that timing?</Label>
              <div className="mt-3">
                <VariancePills
                  value={amSunVariance}
                  onChange={(v) =>
                    setValue("amSunVariance", v as Variance | undefined, { shouldDirty: true })
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium">
            When do you first look at your phone / screens?
          </Label>
          <div className="mt-3">
            <PillRow
              options={AM_PHONE_OPTIONS}
              value={amPhoneWindow}
              onChange={(v) =>
                setValue("amPhoneWindow", v as AmPhoneWindow | undefined, { shouldDirty: true })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            When do you have your first social interaction?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">Time after waking.</p>
          <div className="mt-3">
            <PillRow
              options={SOCIAL_OPTIONS}
              value={firstSocialWindow}
              onChange={(v) =>
                setValue("firstSocialWindow", v as FirstSocialWindow | undefined, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

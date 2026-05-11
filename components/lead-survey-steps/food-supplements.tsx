"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { pillStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { SupplementSection } from "@/components/ui/supplement-section";
import { ScorePicker } from "@/components/ui/score-picker";

interface LeadFoodSupplementsProps {
  form: UseFormReturn<FormData>;
}

const CAFFEINE_SOURCES = [
  { id: "coffee", label: "Coffee" },
  { id: "tea", label: "Tea" },
  { id: "pre_workout", label: "Pre-workout" },
  { id: "pills_supplements", label: "Pills / supplements" },
  { id: "other", label: "Other" },
];

const WATER_ADDITIONS = [
  { id: "citrus_juice", label: "Citrus juice" },
  { id: "honey_maple", label: "Honey or maple syrup" },
  { id: "sea_salt", label: "Sea salt" },
  { id: "trace_minerals", label: "Trace minerals" },
  { id: "other", label: "Other" },
];

export function LeadFoodSupplements({ form }: LeadFoodSupplementsProps) {
  const { register, setValue, watch } = form;

  const firstMealTime = watch("firstMealTime");
  const lastMealTime = watch("lastMealTime");
  const caffeineSources = watch("caffeineSources") || [];
  const waterAdditions = watch("waterAdditions") || [];
  const hasLowNutrientHistory = watch("hasLowNutrientHistory");

  const hasCaffeine = caffeineSources.length > 0;
  const hasCaffeineOther = caffeineSources.includes("other");
  const hasWaterOther = waterAdditions.includes("other");

  function toggleCaffeine(id: string) {
    const next = caffeineSources.includes(id)
      ? caffeineSources.filter((s) => s !== id)
      : [...caffeineSources, id];
    setValue("caffeineSources", next, { shouldDirty: true });
    if (!next.includes("other")) setValue("caffeineSourceOther", undefined, { shouldDirty: true });
    if (next.length === 0) {
      setValue("firstCaffeineTime", undefined, { shouldDirty: true });
      setValue("lastCaffeineTime", undefined, { shouldDirty: true });
    }
  }

  function toggleWater(id: string) {
    const next = waterAdditions.includes(id)
      ? waterAdditions.filter((s) => s !== id)
      : [...waterAdditions, id];
    setValue("waterAdditions", next, { shouldDirty: true });
    if (!next.includes("other")) setValue("waterAdditionOther", undefined, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Food &amp; Supplements
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Meal timing, caffeine, and what you take.
      </p>

      <div className="mt-8 space-y-8">
        {/* Meal timing */}
        <div>
          <Label className="text-sm font-medium">
            What time was your first and last meal or snack yesterday?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Think about everything you ate or drank (besides water) from when you woke up to when you went to sleep.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
              <Label className="text-xs text-muted-foreground">First meal / snack</Label>
              <TimePicker
                value={firstMealTime}
                onChange={(v) => setValue("firstMealTime", v, { shouldDirty: true })}
                className="bg-background"
              />
              <div>
                <Label className="text-xs text-muted-foreground">What was it?</Label>
                <Input
                  placeholder="e.g., Eggs and toast, coffee"
                  className="mt-1 h-10 rounded-xl text-sm"
                  {...register("firstMealContent")}
                />
              </div>
            </div>
            <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
              <Label className="text-xs text-muted-foreground">Last meal / snack</Label>
              <TimePicker
                value={lastMealTime}
                onChange={(v) => setValue("lastMealTime", v, { shouldDirty: true })}
                className="bg-background"
              />
              <div>
                <Label className="text-xs text-muted-foreground">What was it?</Label>
                <Input
                  placeholder="e.g., Chips, herbal tea"
                  className="mt-1 h-10 rounded-xl text-sm"
                  {...register("lastMealContent")}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-sm font-medium">
              How reflective is this of a typical day of eating in the past 1–2 weeks?
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              0 = nothing like usual · 10 = exactly like a typical day
            </p>
            <div className="mt-3">
              <ScorePicker
                value={watch("mealTimingReflectivityScore")}
                onChange={(v) =>
                  setValue("mealTimingReflectivityScore", v, { shouldDirty: true })
                }
              />
            </div>
            <div className="mt-3">
              <Textarea
                rows={3}
                placeholder="Anything different about yesterday vs. a typical day? Any pattern of variation in the last 1–2 weeks?"
                {...register("mealTimingReflectivityNotes")}
              />
            </div>
          </div>
        </div>

        {/* Caffeine */}
        <div>
          <Label className="text-sm font-medium">
            Any of these caffeine sources in the last 3 days?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CAFFEINE_SOURCES.map((s) => {
              const selected = caffeineSources.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleCaffeine(s.id)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {hasCaffeineOther && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Input
                placeholder="Describe other caffeine sources…"
                className="h-12 rounded-xl text-base"
                {...register("caffeineSourceOther")}
              />
            </div>
          )}

          {hasCaffeine && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
              <Label className="text-sm font-medium">
                On your most recent day of consumption, when was your first and last caffeine?
              </Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">First</Label>
                  <div className="mt-1">
                    <TimePicker
                      value={watch("firstCaffeineTime")}
                      onChange={(v) => setValue("firstCaffeineTime", v, { shouldDirty: true })}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Last</Label>
                  <div className="mt-1">
                    <TimePicker
                      value={watch("lastCaffeineTime")}
                      onChange={(v) => setValue("lastCaffeineTime", v, { shouldDirty: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Water */}
        <div>
          <Label className="text-sm font-medium">
            Do you add any of the following to your drinking water?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {WATER_ADDITIONS.map((w) => {
              const selected = waterAdditions.includes(w.id);
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => toggleWater(w.id)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {w.label}
                </button>
              );
            })}
          </div>

          {hasWaterOther && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Input
                placeholder="What else do you add?"
                className="h-12 rounded-xl text-base"
                {...register("waterAdditionOther")}
              />
            </div>
          )}
        </div>

        {/* Past tests */}
        <div>
          <Label className="text-sm font-medium">
            Have past tests revealed any low or imbalanced nutrients, minerals, or biochemical markers?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            e.g., low vitamin D, ferritin, B12, magnesium, cortisol, thyroid hormones, etc.
          </p>
          <div className="mt-3 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() =>
                  setValue(
                    "hasLowNutrientHistory",
                    hasLowNutrientHistory === val ? undefined : val,
                    { shouldDirty: true }
                  )
                }
                className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                  hasLowNutrientHistory === val ? pillStyles.selected : pillStyles.unselected
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>

          {hasLowNutrientHistory === true && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Input
                placeholder="e.g., Low vitamin D (2022), low ferritin, elevated cortisol…"
                className="h-12 rounded-xl text-base"
                {...register("lowNutrientHistoryDetails")}
              />
            </div>
          )}
        </div>

        {/* Supplements + medications */}
        <SupplementSection form={form} />
      </div>
    </div>
  );
}

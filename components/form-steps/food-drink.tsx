"use client";

import { useEffect, useRef } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import { FormData } from "@/lib/types";
import { pillStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker";
import { Textarea } from "@/components/ui/textarea";

interface FoodDrinkProps {
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

const PLACEHOLDERS = [
  "e.g., Eggs benedict, orange juice",
  "e.g., Protein bar",
  "e.g., Turkey sandwich, chips",
  "e.g., Ice cream cone"
];

export function FoodDrink({ form }: FoodDrinkProps) {
  const { register, setValue, watch, control } = form;

  const { fields, append } = useFieldArray({
    control,
    name: "foodLog",
  });

  const initialized = useRef(false);
  useEffect(() => {
    if (fields.length === 0 && !initialized.current) {
      initialized.current = true;
      append([
        { items: "", mealType: "meal", location: "" },
        { items: "", mealType: "snack", location: "" },
        { items: "", mealType: "meal", location: "" },
        { items: "", mealType: "snack", location: "" },
      ]);
    }
  }, [fields.length, append]);

  const caffeineSources = watch("caffeineSources") || [];
  const waterAdditions = watch("waterAdditions") || [];
  const alcoholLast3Days = watch("alcoholLast3Days");
  const alcoholEveningPattern = watch("alcoholEveningPattern");

  const hasCaffeine = caffeineSources.length > 0;
  const hasCaffeineOther = caffeineSources.includes("other");
  const hasWaterOther = waterAdditions.includes("other");

  function toggleCaffeine(id: string) {
    const next = caffeineSources.includes(id)
      ? caffeineSources.filter((s) => s !== id)
      : [...caffeineSources, id];
    setValue("caffeineSources", next, { shouldDirty: true });
    if (!next.includes("other")) {
      setValue("caffeineSourceOther", undefined, { shouldDirty: true });
    }
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
    if (!next.includes("other")) {
      setValue("waterAdditionOther", undefined, { shouldDirty: true });
    }
  }

  function toggleBool(
    field: "alcoholLast3Days" | "alcoholEveningPattern",
    val: boolean,
    current: boolean | undefined
  ) {
    setValue(field, current === val ? undefined : val, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Food, drink, supplements</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Caffeine, hydration, and alcohol patterns.
      </p>
      <p className="mt-3 rounded-xl bg-muted px-4 py-3 text-center text-xs text-muted-foreground">
        None of this information will be shared. Answer honestly — it helps build a more accurate picture.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <Label className="text-sm font-medium">
            List everything you ate in the last 24 hours
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">Don&apos;t worry about portion sizes. Group by meals/snacks.</p>
          
          <div className="mt-4 space-y-4">
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[600px] space-y-3">
                <div className="grid grid-cols-[3fr_2fr] gap-3 px-1">
                  <Label className="text-xs text-muted-foreground">Food/Drink Items</Label>
                  <Label className="text-xs text-muted-foreground">Location</Label>
                </div>
                
                {fields.map((field, index) => {
                  return (
                    <div key={field.id} className="grid grid-cols-[3fr_2fr] gap-3">
                      <Input 
                        placeholder={PLACEHOLDERS[index] || "e.g., Apple slices"} 
                        className="h-12 rounded-xl text-base"
                        {...register(`foodLog.${index}.items` as const)} 
                      />
                      <Input 
                        placeholder="e.g., home, work" 
                        className="h-12 rounded-xl text-base"
                        {...register(`foodLog.${index}.location` as const)} 
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => append({ items: "", mealType: "meal", location: "" })}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Plus className="h-4 w-4" />
              </div>
              Add a line
            </button>
          </div>

          <div className="mt-8">
            <Label className="text-sm font-medium">
              What time was your first and last meal or snack yesterday?
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Think about everything you ate or drank (besides water) from when you woke up to when you went to sleep yesterday.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border bg-muted/20 p-4">
                <Label className="text-xs text-muted-foreground">First meal / snack</Label>
                <div className="mt-2">
                  <TimePicker
                    value={watch("firstMealTime")}
                    onChange={(v) => setValue("firstMealTime", v, { shouldDirty: true })}
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4">
                <Label className="text-xs text-muted-foreground">Last meal / snack</Label>
                <div className="mt-2">
                  <TimePicker
                    value={watch("lastMealTime")}
                    onChange={(v) => setValue("lastMealTime", v, { shouldDirty: true })}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

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

        <div>
          <Label className="text-sm font-medium">Did you drink alcohol in the last 3 days?</Label>
          <div className="mt-3 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => toggleBool("alcoholLast3Days", val, alcoholLast3Days)}
                className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                  alcoholLast3Days === val ? pillStyles.selected : pillStyles.unselected
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            In the last 1–2 weeks, have you had alcohol in the evening to wind down or socialize?
          </Label>
          <div className="mt-3 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => toggleBool("alcoholEveningPattern", val, alcoholEveningPattern)}
                className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                  alcoholEveningPattern === val ? pillStyles.selected : pillStyles.unselected
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Supplements or medications you take regularly
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Rx, OTC, vitamins, herbs — one per line.
          </p>
          <div className="mt-2">
            <Textarea
              rows={5}
              placeholder={"e.g., Magnesium glycinate 400mg\nVitamin D3 5000 IU\nLexapro 10mg"}
              {...register("supplementsMeds")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

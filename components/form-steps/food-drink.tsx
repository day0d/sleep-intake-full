"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormData,
  DietType,
  CaffeineVolume,
  Variance,
} from "@/lib/types";
import { cardStyles, pillStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import { PillRow } from "@/components/ui/pill-row";
import { VariancePills } from "@/components/ui/variance-pills";

interface FoodDrinkProps {
  form: UseFormReturn<FormData>;
}

const DIET_OPTIONS: { id: DietType; label: string; emoji: string }[] = [
  { id: "standard", label: "Standard / Mixed", emoji: "🍽️" },
  { id: "mediterranean", label: "Mediterranean", emoji: "🥗" },
  { id: "low_carb", label: "Low-carb", emoji: "🥩" },
  { id: "keto", label: "Keto", emoji: "🥑" },
  { id: "carnivore", label: "Carnivore", emoji: "🦴" },
  { id: "vegetarian", label: "Vegetarian", emoji: "🥦" },
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "paleo", label: "Paleo", emoji: "🍗" },
  { id: "intermittent_fasting", label: "Intermittent fasting", emoji: "⏱️" },
  { id: "none", label: "No approach", emoji: "❓" },
];

const METABOLIC_SYMPTOMS = [
  "Post-meal crashes",
  "Hangry between meals",
  "Afternoon energy slumps",
  "Sugar cravings",
  "Weight around midsection",
  "Wake hungry at night",
];

const CAFFEINE_OPTIONS: { id: CaffeineVolume; label: string }[] = [
  { id: "none", label: "None" },
  { id: "1_cup", label: "1 cup" },
  { id: "2_3_cups", label: "2–3 cups" },
  { id: "4_plus", label: "4+ cups" },
];

const ELECTROLYTE_HABITS = [
  "Salt my food / drinks",
  "Take electrolyte mix",
  "Mostly filtered / RO water",
  "Don't think about it",
];

const ELECTROLYTE_SYMPTOMS = [
  "Muscle cramps",
  "Dizzy on standing",
  "Headaches",
  "Heart palpitations",
  "General fatigue",
];

export function FoodDrink({ form }: FoodDrinkProps) {
  const { register, setValue, watch } = form;

  const dietType = watch("dietType");
  const metabolicSymptoms = watch("metabolicSymptoms") || [];
  const firstMealVariance = watch("firstMealVariance");
  const lastMealVariance = watch("lastMealVariance");
  const caffeineVolume = watch("caffeineVolume");
  const electrolyteHabits = watch("electrolyteHabits") || [];
  const electrolyteSymptoms = watch("electrolyteSymptoms") || [];

  const noCaffeine = caffeineVolume === "none";

  function toggleDiet(id: DietType) {
    setValue("dietType", dietType === id ? undefined : id, {
      shouldDirty: true,
    });
  }

  function toggleMulti(
    field:
      | "metabolicSymptoms"
      | "electrolyteHabits"
      | "electrolyteSymptoms",
    current: string[],
    id: string
  ) {
    const next = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    setValue(field, next, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Food & drink</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Diet, meal timing, caffeine, and electrolytes.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <Label className="text-sm font-medium">What best describes your diet?</Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {DIET_OPTIONS.map((d) => {
              const selected = dietType === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDiet(d.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected ? cardStyles.selected : cardStyles.unselected
                  }`}
                >
                  <span className="text-2xl">{d.emoji}</span>
                  <span className="text-xs font-medium leading-tight">{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Any metabolic symptoms?</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {METABOLIC_SYMPTOMS.map((s) => {
              const selected = metabolicSymptoms.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    toggleMulti("metabolicSymptoms", metabolicSymptoms, s)
                  }
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium">First meal</Label>
            <div className="mt-1.5">
              <TimePicker {...register("firstMealTime")} />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Last meal</Label>
            <div className="mt-1.5">
              <TimePicker {...register("lastMealTime")} />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">How much does first meal time vary?</Label>
          <div className="mt-3">
            <VariancePills
              value={firstMealVariance}
              onChange={(v) =>
                setValue("firstMealVariance", v as Variance | undefined, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">How much does last meal time vary?</Label>
          <div className="mt-3">
            <VariancePills
              value={lastMealVariance}
              onChange={(v) =>
                setValue("lastMealVariance", v as Variance | undefined, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">How much caffeine per day?</Label>
          <div className="mt-3">
            <PillRow
              options={CAFFEINE_OPTIONS}
              value={caffeineVolume}
              onChange={(v) => {
                const next = v as CaffeineVolume | undefined;
                setValue("caffeineVolume", next, { shouldDirty: true });
                if (next === "none" || next === undefined) {
                  setValue("firstCaffeineTime", undefined, { shouldDirty: true });
                  setValue("lastCaffeineTime", undefined, { shouldDirty: true });
                }
              }}
            />
          </div>
        </div>

        {!noCaffeine && caffeineVolume && (
          <div className="animate-in slide-in-from-top-2 duration-200 grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">First caffeine</Label>
              <div className="mt-1.5">
                <TimePicker {...register("firstCaffeineTime")} />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Last caffeine</Label>
              <div className="mt-1.5">
                <TimePicker {...register("lastCaffeineTime")} />
              </div>
            </div>
          </div>
        )}

        <div>
          <Label className="text-sm font-medium">Electrolyte habits?</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {ELECTROLYTE_HABITS.map((h) => {
              const selected = electrolyteHabits.includes(h);
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() =>
                    toggleMulti("electrolyteHabits", electrolyteHabits, h)
                  }
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {h}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Any of these recently?
          </Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {ELECTROLYTE_SYMPTOMS.map((s) => {
              const selected = electrolyteSymptoms.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    toggleMulti("electrolyteSymptoms", electrolyteSymptoms, s)
                  }
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

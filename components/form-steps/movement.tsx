"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormData,
  ExerciseFrequency,
  ExerciseTiming,
  Recovery,
  Variance,
} from "@/lib/types";
import { cardStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { PillRow } from "@/components/ui/pill-row";
import { VariancePills } from "@/components/ui/variance-pills";

interface MovementProps {
  form: UseFormReturn<FormData>;
}

const EXERCISE_TYPES = [
  { id: "Strength", emoji: "🏋️" },
  { id: "Running", emoji: "🏃" },
  { id: "Cycling", emoji: "🚴" },
  { id: "Swimming", emoji: "🏊" },
  { id: "Yoga", emoji: "🧘" },
  { id: "Pilates", emoji: "🤸" },
  { id: "Walking", emoji: "🚶" },
  { id: "HIIT", emoji: "🔥" },
  { id: "Sports", emoji: "⚽" },
  { id: "None / Rarely", emoji: "❓" },
];

const FREQUENCY_OPTIONS: { id: ExerciseFrequency; label: string }[] = [
  { id: "0", label: "0" },
  { id: "1-2", label: "1–2" },
  { id: "3-4", label: "3–4" },
  { id: "5-6", label: "5–6" },
  { id: "7", label: "7" },
];

const TIMING_OPTIONS: { id: ExerciseTiming; label: string }[] = [
  { id: "am", label: "AM" },
  { id: "midday", label: "Midday" },
  { id: "pm", label: "PM" },
  { id: "evening", label: "Evening" },
  { id: "varies", label: "Varies" },
];

const RECOVERY_OPTIONS: { id: Recovery; label: string }[] = [
  { id: "great", label: "Great" },
  { id: "ok", label: "OK" },
  { id: "struggling", label: "Struggling" },
];

export function Movement({ form }: MovementProps) {
  const { setValue, watch } = form;

  const exerciseTypes = watch("exerciseTypes") || [];
  const exerciseFrequency = watch("exerciseFrequency");
  const exerciseFrequencyVariance = watch("exerciseFrequencyVariance");
  const exerciseTiming = watch("exerciseTiming");
  const exerciseTimingVariance = watch("exerciseTimingVariance");
  const recovery = watch("recovery");

  function toggleType(id: string) {
    const next = exerciseTypes.includes(id)
      ? exerciseTypes.filter((t) => t !== id)
      : [...exerciseTypes, id];
    setValue("exerciseTypes", next, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Movement</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        What you do, how often, and how it feels.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <Label className="text-sm font-medium">What types of exercise do you do?</Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {EXERCISE_TYPES.map((e) => {
              const selected = exerciseTypes.includes(e.id);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggleType(e.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected ? cardStyles.selected : cardStyles.unselected
                  }`}
                >
                  <span className="text-2xl">{e.emoji}</span>
                  <span className="text-xs font-medium leading-tight">{e.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">How many days per week?</Label>
          <div className="mt-3">
            <PillRow
              options={FREQUENCY_OPTIONS}
              value={exerciseFrequency}
              onChange={(v) =>
                setValue(
                  "exerciseFrequency",
                  v as ExerciseFrequency | undefined,
                  { shouldDirty: true }
                )
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">How consistent week-to-week?</Label>
          <div className="mt-3">
            <VariancePills
              value={exerciseFrequencyVariance}
              onChange={(v) =>
                setValue(
                  "exerciseFrequencyVariance",
                  v as Variance | undefined,
                  { shouldDirty: true }
                )
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">When do you usually exercise?</Label>
          <div className="mt-3">
            <PillRow
              options={TIMING_OPTIONS}
              value={exerciseTiming}
              onChange={(v) =>
                setValue("exerciseTiming", v as ExerciseTiming | undefined, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">How consistent is that timing?</Label>
          <div className="mt-3">
            <VariancePills
              value={exerciseTimingVariance}
              onChange={(v) =>
                setValue(
                  "exerciseTimingVariance",
                  v as Variance | undefined,
                  { shouldDirty: true }
                )
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">How&apos;s your recovery?</Label>
          <div className="mt-3">
            <PillRow
              options={RECOVERY_OPTIONS}
              value={recovery}
              onChange={(v) =>
                setValue("recovery", v as Recovery | undefined, {
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

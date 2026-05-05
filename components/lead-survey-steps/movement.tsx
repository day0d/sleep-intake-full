"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, ExerciseFrequency, ExerciseTiming } from "@/lib/types";
import { cardStyles, pillStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { PillRow } from "@/components/ui/pill-row";

interface LeadMovementProps {
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
  { id: "morning", label: "Morning" },
  { id: "midday", label: "Midday" },
  { id: "late_afternoon", label: "Late afternoon" },
  { id: "evening", label: "Evening" },
  { id: "varies", label: "Varies" },
];

const RECOVERY_SYMPTOMS = [
  { id: "persistent_soreness", label: "Persistent muscle soreness (48+ hours)" },
  { id: "persistent_stiffness", label: "Persistent stiffness" },
  { id: "heaviness_sluggishness", label: "Heaviness / sluggishness" },
  { id: "irregular_heart_rate", label: "Increased or irregular heart rate" },
  { id: "frequent_illness", label: "Frequent illness" },
  { id: "decreasing_performance", label: "Decreasing exercise performance" },
];

export function LeadMovement({ form }: LeadMovementProps) {
  const { setValue, watch } = form;

  const exerciseTypes = watch("exerciseTypes") || [];
  const exerciseFrequency = watch("exerciseFrequency");
  const exerciseTiming = watch("exerciseTiming") || [];
  const exerciseRecoverySymptoms = watch("exerciseRecoverySymptoms") || [];

  function toggleType(id: string) {
    const next = exerciseTypes.includes(id)
      ? exerciseTypes.filter((t) => t !== id)
      : [...exerciseTypes, id];
    setValue("exerciseTypes", next, { shouldDirty: true });
  }

  function toggleTiming(id: ExerciseTiming) {
    const next = exerciseTiming.includes(id)
      ? exerciseTiming.filter((t) => t !== id)
      : [...exerciseTiming, id];
    setValue("exerciseTiming", next, { shouldDirty: true });
  }

  function toggleRecovery(id: string) {
    const next = exerciseRecoverySymptoms.includes(id)
      ? exerciseRecoverySymptoms.filter((s) => s !== id)
      : [...exerciseRecoverySymptoms, id];
    setValue("exerciseRecoverySymptoms", next, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Movement</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        What you do, how often, and how your body responds.
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
                setValue("exerciseFrequency", v as ExerciseFrequency | undefined, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">When do you usually exercise?</Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TIMING_OPTIONS.map((t) => {
              const selected = exerciseTiming.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTiming(t.id)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Any of these exercise recovery symptoms?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {RECOVERY_SYMPTOMS.map((s) => {
              const selected = exerciseRecoverySymptoms.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleRecovery(s.id)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

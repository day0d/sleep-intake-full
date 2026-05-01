"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, WakeupType } from "@/lib/types";
import { cardStyles, pillStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SleepQualityProps {
  form: UseFormReturn<FormData>;
}

const SIGNALS = [
  { id: "Trouble falling asleep", emoji: "🌙" },
  { id: "Trouble staying asleep", emoji: "⏰" },
  { id: "Waking up too early", emoji: "🌅" },
  { id: "Sleep isn't rejuvenating", emoji: "😩" },
];

const TYPOLOGY: { id: WakeupType; label: string; emoji: string }[] = [
  { id: "pain", label: "Physical pain / discomfort", emoji: "🤕" },
  { id: "restlessness", label: "Restlessness", emoji: "🦵" },
  { id: "mental_anxiety", label: "Racing thoughts / mental anxiety", emoji: "🧠" },
  { id: "somatic_anxiety", label: "Somatic anxiety (pounding heart, tight chest)", emoji: "💓" },
  { id: "partner_environmental", label: "Partner or environmental disturbance", emoji: "👥" },
  { id: "overheating", label: "Overheating / sweats", emoji: "🥵" },
  { id: "cold", label: "Cold", emoji: "🥶" },
  { id: "vivid_dreams", label: "Vivid or absurd dreams", emoji: "🌀" },
  { id: "frequent_urination", label: "Frequent urination", emoji: "🚿" },
  { id: "other", label: "Other", emoji: "❓" },
];

const LYING_AWAKE_OPTIONS = [
  { id: "body_on_mind_tired", label: "Physically activated, but mentally fatigued" },
  { id: "mind_on_body_tired", label: "Mentally alert, but physically tired" },
  { id: "both_on", label: "Both physically and mentally alert" },
  { id: "both_tired", label: "Both physically and mentally tired" },
];


export function SleepQuality({ form }: SleepQualityProps) {
  const { register, setValue, watch } = form;

  const sleepSignals = watch("sleepSignals") || [];
  const wakeupTypology = watch("wakeupTypology") || [];
  const lyingAwakeState = watch("lyingAwakeState") || [];

  const hasFrequentWakeups = sleepSignals.includes("Trouble staying asleep");
  const hasLyingAwake =
    sleepSignals.includes("Trouble falling asleep") ||
    sleepSignals.includes("Trouble staying asleep") ||
    sleepSignals.includes("Waking up too early");
  const hasOtherWakeup = wakeupTypology.includes("other");

  function toggleSignal(id: string) {
    const next = sleepSignals.includes(id)
      ? sleepSignals.filter((s) => s !== id)
      : [...sleepSignals, id];
    setValue("sleepSignals", next, { shouldDirty: true });
    if (!next.includes("Trouble staying asleep")) {
      setValue("wakeupTypology", [], { shouldDirty: true });
      setValue("wakeupOther", undefined, { shouldDirty: true });
    }
    if (
      !next.includes("Trouble falling asleep") &&
      !next.includes("Trouble staying asleep") &&
      !next.includes("Waking up too early")
    ) {
      setValue("lyingAwakeState", [], { shouldDirty: true });
    }
  }

  function toggleTypology(id: WakeupType) {
    const next = wakeupTypology.includes(id)
      ? wakeupTypology.filter((t) => t !== id)
      : [...wakeupTypology, id];
    setValue("wakeupTypology", next, { shouldDirty: true });
    if (!next.includes("other")) {
      setValue("wakeupOther", undefined, { shouldDirty: true });
    }
  }

  function toggleLyingAwake(id: string) {
    const next = lyingAwakeState.includes(id)
      ? lyingAwakeState.filter((s) => s !== id)
      : [...lyingAwakeState, id];
    setValue("lyingAwakeState", next, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Sleep quality</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Help me understand what&apos;s going on with your sleep.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <Label className="text-sm font-medium">Which of these apply to you?</Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {SIGNALS.map((s) => {
              const selected = sleepSignals.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSignal(s.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected ? cardStyles.selected : cardStyles.unselected
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-xs font-medium leading-tight">{s.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {hasFrequentWakeups && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">What typically wakes you up?</Label>
            <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {TYPOLOGY.map((t) => {
                const selected = wakeupTypology.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTypology(t.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                      selected ? cardStyles.selected : cardStyles.unselected
                    }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-xs font-medium leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {hasOtherWakeup && (
              <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                <Input
                  placeholder="Describe what wakes you up…"
                  className="h-12 rounded-xl text-base"
                  {...register("wakeupOther")}
                />
              </div>
            )}
          </div>
        )}

        {hasLyingAwake && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">
              While lying awake, how do you feel? Select all that apply.
            </Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {LYING_AWAKE_OPTIONS.map((o) => {
                const selected = lyingAwakeState.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleLyingAwake(o.id)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                      selected ? pillStyles.selected : pillStyles.unselected
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, SweatingShivering } from "@/lib/types";
import { Label } from "@/components/ui/label";

interface SignalsProps {
  form: UseFormReturn<FormData>;
}

const SLEEP_SIGNAL_OPTIONS = [
  { id: "Trouble falling asleep", emoji: "🌙" },
  { id: "Frequent wakeups", emoji: "⏰" },
  { id: "Sleep through but don't feel rested", emoji: "😩" },
  { id: "None of the above", emoji: "✅" },
];

const SWEATING_OPTIONS: { id: SweatingShivering; label: string }[] = [
  { id: "sweating", label: "Sweating" },
  { id: "shivering", label: "Shivering" },
  { id: "both", label: "Both" },
  { id: "no", label: "No" },
];

export function Signals({ form }: SignalsProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const sleepSignals = watch("sleepSignals") || [];
  const sweatingShivering = watch("sweatingShivering");

  function toggleSignal(signal: string) {
    let next: string[];
    if (signal === "None of the above") {
      next = sleepSignals.includes(signal) ? [] : [signal];
    } else {
      const withoutNone = sleepSignals.filter(
        (s) => s !== "None of the above"
      );
      next = withoutNone.includes(signal)
        ? withoutNone.filter((s) => s !== signal)
        : [...withoutNone, signal];
    }
    setValue("sleepSignals", next, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Sleep signals
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Help me understand what&apos;s going on with your sleep.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <Label className="text-sm font-medium">
            Which of these apply to you?
          </Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {SLEEP_SIGNAL_OPTIONS.map((option) => {
              const selected = sleepSignals.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleSignal(option.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected
                      ? "border-ring bg-accent"
                      : "border-border bg-card hover:border-ring/50"
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-xs font-medium leading-tight">
                    {option.id}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.sleepSignals && (
            <p className="mt-1 text-xs text-red-600">
              {errors.sleepSignals.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium">
            Do you ever wake up sweating or shivering?
          </Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {SWEATING_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  setValue("sweatingShivering", option.id, {
                    shouldDirty: true,
                  })
                }
                className={`rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-colors ${
                  sweatingShivering === option.id
                    ? "border-ring bg-accent text-accent-foreground"
                    : "border-border bg-card text-foreground hover:border-ring/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.sweatingShivering && (
            <p className="mt-1 text-xs text-red-600">
              {errors.sweatingShivering.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

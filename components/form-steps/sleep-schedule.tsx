"use client";

import { useEffect, useRef } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { FormData } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";

interface SleepScheduleProps {
  form: UseFormReturn<FormData>;
}

function clampNum(val: string, min: number, max: number): number | undefined {
  if (val.trim() === "") return undefined;
  const n = Number(val);
  if (Number.isNaN(n)) return undefined;
  return Math.min(max, Math.max(min, n));
}

interface PatternRowProps {
  index: number;
  isFirst: boolean;
  showRemove: boolean;
  form: UseFormReturn<FormData>;
  onRemove: () => void;
}

function PatternRow({
  index,
  isFirst,
  showRemove,
  form,
  onRemove,
}: PatternRowProps) {
  const { watch, setValue, register } = form;

  return (
    <div className="relative rounded-2xl border bg-card px-4 py-4 pr-10">
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove row"
          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {isFirst ? (
        <p className="mb-3 text-sm font-semibold text-foreground">
          What time did you fall asleep and get out of bed last night?
        </p>
      ) : (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pattern {index + 1}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Fell asleep</Label>
          <div className="mt-1">
            <TimePicker
              value={watch(`sleepPatterns.${index}.fellAsleep` as const)}
              onChange={(v) =>
                setValue(`sleepPatterns.${index}.fellAsleep`, v, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Got out of bed</Label>
          <div className="mt-1">
            <TimePicker
              value={watch(`sleepPatterns.${index}.wokeUp` as const)}
              onChange={(v) =>
                setValue(`sleepPatterns.${index}.wokeUp`, v, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">
            Sleep efficiency
          </Label>
          <div className="mt-1">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={10}
              placeholder="0–10"
              {...register(`sleepPatterns.${index}.efficiency` as const, {
                setValueAs: (v) => clampNum(String(v ?? ""), 0, 10),
              })}
              className="h-12 w-full rounded-xl border bg-background px-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              * 0 = lay awake all night · 10 = didn&apos;t wake once
            </p>
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">% calibration</Label>
          <div className="relative mt-1">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              placeholder="e.g., 70"
              {...register(`sleepPatterns.${index}.percentage` as const, {
                setValueAs: (v) => clampNum(String(v ?? ""), 1, 100),
              })}
              className="h-12 w-full rounded-xl border bg-background px-3 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            * What % of nights look like this pattern
          </p>
        </div>
      </div>
    </div>
  );
}

export function SleepSchedule({ form }: SleepScheduleProps) {
  const { setValue, watch, control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sleepPatterns",
  });

  const patterns = watch("sleepPatterns") || [];
  const total = patterns.reduce(
    (sum, r) => sum + (typeof r.percentage === "number" ? r.percentage : 0),
    0
  );
  const totalIsValid = total === 100;

  const naturalBedtime = watch("naturalBedtime");
  const naturalWakeTime = watch("naturalWakeTime");

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && fields.length === 0) {
      initialized.current = true;
      append([{}, {}], { shouldFocus: false });
    }
  }, [fields.length, append]);

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Your sleep schedule
      </h1>

      <div className="mt-6 space-y-4">
        {fields.map((field, index) => (
          <div key={field.id}>
            <PatternRow
              index={index}
              isFirst={index === 0}
              showRemove={fields.length > 1}
              form={form}
              onRemove={() => remove(index)}
            />
            {index === 0 && fields.length > 1 && (
              <div className="my-4 rounded-xl bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                Add additional rows for any other typical sleep patterns (use
                the leftover %). Keep adding patterns until your % adds up to
                100.
              </div>
            )}
          </div>
        ))}

        {fields.length === 1 && (
          <div className="rounded-xl bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            Add additional rows for any other typical sleep patterns (use the
            leftover %). Keep adding patterns until your % adds up to 100.
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => append({})}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-4 w-4" />
            </div>
            Add another pattern
          </button>

          <div
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              totalIsValid
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            Total: {total}%
          </div>
        </div>

        {!totalIsValid && (
          <p className="text-xs text-amber-700">
            Patterns must add up to exactly 100% before continuing.
          </p>
        )}

        <div className="pt-4">
          <Label className="text-sm font-medium">
            If you had no commitments, when would you naturally sleep?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            No alarm, nothing strenuous the night before.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Bedtime</p>
              <TimePicker
                value={naturalBedtime}
                onChange={(v) => setValue("naturalBedtime", v, { shouldDirty: true })}
              />
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Wake time</p>
              <TimePicker
                value={naturalWakeTime}
                onChange={(v) =>
                  setValue("naturalWakeTime", v, { shouldDirty: true })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

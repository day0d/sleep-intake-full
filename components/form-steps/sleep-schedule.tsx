"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, SleepAmount, TimeVariance, Variance } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import { PillRow } from "@/components/ui/pill-row";
import { VariancePills } from "@/components/ui/variance-pills";
import { pillStyles } from "@/lib/ui-styles";

interface SleepScheduleProps {
  form: UseFormReturn<FormData>;
}

const SLEEP_AMOUNT_OPTIONS = [
  { id: "<5" as const, label: "<5 hrs" },
  { id: "5-6" as const, label: "5–6" },
  { id: "6-7" as const, label: "6–7" },
  { id: "7-8" as const, label: "7–8" },
  { id: "8-9" as const, label: "8–9" },
  { id: "9+" as const, label: "9+" },
];

const TIME_VARIANCE_OPTIONS: { id: TimeVariance; label: string }[] = [
  { id: "30min", label: "30 min" },
  { id: "1h", label: "1 hr" },
  { id: "2h", label: "2 hrs" },
  { id: ">2h", label: ">2 hrs" },
];

function TimeVariancePicker({
  value,
  onChange,
}: {
  value: TimeVariance | undefined;
  onChange: (v: TimeVariance | undefined) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {TIME_VARIANCE_OPTIONS.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(selected ? undefined : opt.id)}
            className={`rounded-full border-2 py-1.5 text-xs font-medium transition-colors ${
              selected ? pillStyles.selected : pillStyles.unselected
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function SleepSchedule({ form }: SleepScheduleProps) {
  const { setValue, watch } = form;

  const bedtime = watch("bedtime");
  const bedtimeVariance = watch("bedtimeVariance");
  const wakeTime = watch("wakeTime");
  const wakeTimeVariance = watch("wakeTimeVariance");
  const naturalBedtime = watch("naturalBedtime");
  const naturalWakeTime = watch("naturalWakeTime");
  const sleepAmount = watch("sleepAmount");
  const sleepAmountVariance = watch("sleepAmountVariance");

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Your sleep schedule
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Typical bedtime, wake time, and how much they shift.
      </p>

      <div className="mt-8 space-y-8">
        {/* Bedtime + variance */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <div>
            <Label className="text-sm font-medium">Bedtime</Label>
            <div className="mt-1.5">
              <TimePicker
                value={bedtime}
                onChange={(v) => setValue("bedtime", v, { shouldDirty: true })}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Varies by
            </Label>
            <div className="mt-1.5">
              <TimeVariancePicker
                value={bedtimeVariance}
                onChange={(v) =>
                  setValue("bedtimeVariance", v, { shouldDirty: true })
                }
              />
            </div>
          </div>
        </div>

        {/* Wake time + variance */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <div>
            <Label className="text-sm font-medium">Wake time</Label>
            <div className="mt-1.5">
              <TimePicker
                value={wakeTime}
                onChange={(v) => setValue("wakeTime", v, { shouldDirty: true })}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Varies by
            </Label>
            <div className="mt-1.5">
              <TimeVariancePicker
                value={wakeTimeVariance}
                onChange={(v) =>
                  setValue("wakeTimeVariance", v, { shouldDirty: true })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            How many hours do you usually sleep?
          </Label>
          <div className="mt-3">
            <PillRow
              options={SLEEP_AMOUNT_OPTIONS}
              value={sleepAmount}
              onChange={(v) =>
                setValue("sleepAmount", v as SleepAmount | undefined, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Does your total sleep vary a lot?
          </Label>
          <div className="mt-3">
            <VariancePills
              value={sleepAmountVariance}
              onChange={(v) =>
                setValue("sleepAmountVariance", v as Variance | undefined, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>

        <div>
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
                onChange={(v) => setValue("naturalWakeTime", v, { shouldDirty: true })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, SleepAmount, Variance } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import { PillRow } from "@/components/ui/pill-row";
import { VariancePills } from "@/components/ui/variance-pills";

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

export function SleepSchedule({ form }: SleepScheduleProps) {
  const { register, setValue, watch } = form;

  const sleepWakeVariance = watch("sleepWakeVariance");
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium">Usual bedtime</Label>
            <div className="mt-1.5">
              <TimePicker {...register("bedtime")} />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Usual wake time</Label>
            <div className="mt-1.5">
              <TimePicker {...register("wakeTime")} />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            How much do those times vary night-to-night?
          </Label>
          <div className="mt-3">
            <VariancePills
              value={sleepWakeVariance}
              onChange={(v) =>
                setValue("sleepWakeVariance", v as Variance | undefined, {
                  shouldDirty: true,
                })
              }
            />
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
              <TimePicker {...register("naturalBedtime")} />
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Wake time</p>
              <TimePicker {...register("naturalWakeTime")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

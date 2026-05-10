"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { MinuteScroll } from "@/components/ui/minute-scroll";
import { ScorePicker } from "@/components/ui/score-picker";

interface Props {
  form: UseFormReturn<FormData>;
}

export function SunExposureSection({ form }: Props) {
  const { setValue, watch } = form;

  const yesterday = watch("amSunYesterday");
  const daysLastWeek = watch("amSunDaysLastWeek");
  const otherDelay = watch("amSunOtherDaysDelay");

  const showOtherDays =
    typeof daysLastWeek === "number" && daysLastWeek < 7;
  const otherCount =
    typeof daysLastWeek === "number" ? 7 - daysLastWeek : 0;

  return (
    <div>
      <Label className="text-sm font-medium">
        How soon after waking did you get direct sunlight on skin yesterday?
      </Label>
      <p className="mt-1 text-xs text-muted-foreground">
        Counts even on cloudy days; indoor light through glass does not count.
      </p>
      <div className="mt-3">
        <MinuteScroll
          value={yesterday}
          onChange={(v) => setValue("amSunYesterday", v, { shouldDirty: true })}
        />
      </div>

      {typeof yesterday === "number" && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
          <Label className="text-sm font-medium">
            How many days last week did you get sun within that same window?
          </Label>
          <div className="mt-3">
            <ScorePicker
              value={daysLastWeek}
              onChange={(v) =>
                setValue("amSunDaysLastWeek", v, { shouldDirty: true })
              }
              min={0}
              max={7}
            />
          </div>
        </div>
      )}

      {showOtherDays && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
          <Label className="text-sm font-medium">
            On the {otherCount} other day{otherCount === 1 ? "" : "s"}, what was
            the typical window?
          </Label>
          <div className="mt-3">
            <MinuteScroll
              value={otherDelay}
              onChange={(v) =>
                setValue("amSunOtherDaysDelay", v, { shouldDirty: true })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

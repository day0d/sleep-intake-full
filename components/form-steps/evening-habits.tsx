"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData, PmPhoneWindow } from "@/lib/types";
import { pillStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PillRow } from "@/components/ui/pill-row";

interface EveningHabitsProps {
  form: UseFormReturn<FormData>;
}

const PM_PHONE_OPTIONS: { id: PmPhoneWindow; label: string }[] = [
  { id: "in_bed", label: "In bed" },
  { id: "30m", label: "30m before" },
  { id: "1h", label: "1h before" },
  { id: "2h+", label: "2h+ before" },
  { id: "not_sure", label: "Not sure" },
];

const LIGHT_LOCATION = [
  { id: "ceiling_overhead", label: "Ceiling / Overhead Lights" },
  { id: "lamps_floor_level", label: "Lamps / Eye- or Floor-Level Lighting" },
];

const LIGHT_TONE = [
  { id: "cool_white", label: "Cool White" },
  { id: "warm_yellow", label: "Warm Yellow-Toned" },
  { id: "amber_orange", label: "Amber / Orange-Toned" },
  { id: "red_toned", label: "Red-Toned" },
];

const LIGHT_INTENSITY = [
  { id: "needle", label: "I could thread a needle or see crumbs on the floor" },
  { id: "read_detail", label: "I could read but wouldn't want to do detail work" },
  { id: "read_squint", label: "I could read, but might need to squint" },
  { id: "move_only", label: "I could move through the room but would struggle to read fine print" },
];

const DEVICE_SCREEN = [
  { id: "bright_daytime", label: "Bright & Clear / Same as daytime tone" },
  { id: "dim_orange", label: "Changed to Dim / Orange-Toned" },
];

export function EveningHabits({ form }: EveningHabitsProps) {
  const { register, setValue, watch } = form;

  const pmPhoneWindow = watch("pmPhoneWindow");
  const eveningLightLocation = watch("eveningLightLocation") || [];
  const eveningLightTone = watch("eveningLightTone") || [];
  const eveningLightIntensity = watch("eveningLightIntensity");
  const eveningDeviceScreen = watch("eveningDeviceScreen") || [];

  function toggleMulti(
    field: "eveningLightLocation" | "eveningLightTone" | "eveningDeviceScreen",
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
      <h1 className="text-center text-2xl font-bold text-foreground">Evening habits</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        How you wind down and the light around you.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <Label className="text-sm font-medium">Describe your wind-down routine</Label>
          <div className="mt-1.5">
            <Textarea
              placeholder="e.g., dinner → shower → read → lights out"
              {...register("pmRoutine")}
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            When do you last look at your phone / screens before bed?
          </Label>
          <div className="mt-3">
            <PillRow
              options={PM_PHONE_OPTIONS}
              value={pmPhoneWindow}
              onChange={(v) =>
                setValue("pmPhoneWindow", v as PmPhoneWindow | undefined, { shouldDirty: true })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Evening lighting environment (especially 2 hrs before bed)
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply in each category.</p>

          <div className="mt-4 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Location
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {LIGHT_LOCATION.map((o) => {
                  const selected = eveningLightLocation.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleMulti("eveningLightLocation", eveningLightLocation, o.id)}
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

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tone
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {LIGHT_TONE.map((o) => {
                  const selected = eveningLightTone.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleMulti("eveningLightTone", eveningLightTone, o.id)}
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

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Intensity
              </p>
              <div className="mt-2 space-y-2">
                {LIGHT_INTENSITY.map((o) => {
                  const selected = eveningLightIntensity === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() =>
                        setValue(
                          "eveningLightIntensity",
                          selected ? undefined : o.id,
                          { shouldDirty: true }
                        )
                      }
                      className={`w-full rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                        selected ? pillStyles.selected : pillStyles.unselected
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Device screens
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {DEVICE_SCREEN.map((o) => {
                  const selected = eveningDeviceScreen.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleMulti("eveningDeviceScreen", eveningDeviceScreen, o.id)}
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
          </div>
        </div>
      </div>
    </div>
  );
}

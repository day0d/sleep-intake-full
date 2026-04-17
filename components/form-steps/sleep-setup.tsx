"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SleepSetupProps {
  form: UseFormReturn<FormData>;
}

const ITEMS = [
  { id: "Sleep mask", emoji: "😴" },
  { id: "Earplugs", emoji: "👂" },
  { id: "Blue-light blocking glasses", emoji: "🕶️" },
  { id: "Sound machine", emoji: "🔊" },
  { id: "Fan", emoji: "🌀" },
  { id: "Air conditioning", emoji: "❄️" },
  { id: "Air purifier", emoji: "🌬️" },
  { id: "Weighted blanket", emoji: "🛏️" },
  { id: "Temperature-regulating bed", emoji: "🌡️" },
];

export function SleepSetup({ form }: SleepSetupProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const itemsOwned = watch("itemsOwned") || [];
  const sharesBed = watch("sharesBedWithPartner");
  const hasBlueLight = itemsOwned.includes("Blue-light blocking glasses");

  function toggleItem(item: string) {
    const current = itemsOwned;
    const next = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    setValue("itemsOwned", next, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Your sleep space setup
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Tell me about your bedroom and habits.
      </p>

      <div className="mt-8 space-y-8">
        {/* Phone location */}
        <div>
          <Label className="text-sm font-medium">
            Where do you put your phone at night?
          </Label>
          <Input
            placeholder="e.g., nightstand, under my pillow, across the room"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("phoneLocation")}
          />
          {errors.phoneLocation && (
            <p className="mt-1 text-xs text-red-600">
              {errors.phoneLocation.message}
            </p>
          )}
        </div>

        {/* Items owned — card grid */}
        <div>
          <Label className="text-sm font-medium">
            Do you have any of the following?
          </Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {ITEMS.map((item) => {
              const selected = itemsOwned.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected
                      ? "border-ring bg-accent"
                      : "border-border bg-card hover:border-ring/50"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-medium leading-tight">
                    {item.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Blue-light glasses conditional */}
        {hasBlueLight && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">
              What color are the lenses?
            </Label>
            <Input
              placeholder="e.g., amber, orange, clear"
              className="mt-1.5 h-12 rounded-xl text-base"
              {...register("blueLightGlassesColor")}
            />
            {errors.blueLightGlassesColor && (
              <p className="mt-1 text-xs text-red-600">
                {errors.blueLightGlassesColor.message}
              </p>
            )}
          </div>
        )}

        {/* Share bed */}
        <div>
          <Label className="text-sm font-medium">
            Do you share a bed with a partner?
          </Label>
          <div className="mt-3 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() =>
                  setValue("sharesBedWithPartner", val, { shouldDirty: true })
                }
                className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                  sharesBed === val
                    ? "border-ring bg-accent text-accent-foreground"
                    : "border-border bg-card text-foreground hover:border-ring/50"
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
          {errors.sharesBedWithPartner && (
            <p className="mt-1 text-xs text-red-600">
              {errors.sharesBedWithPartner.message}
            </p>
          )}
        </div>

        {/* Share blanket conditional */}
        {sharesBed && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium">
              Do you share a blanket?
            </Label>
            <div className="mt-3 flex gap-3">
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() =>
                    setValue("sharesBlanketWithPartner", val, {
                      shouldDirty: true,
                    })
                  }
                  className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                    watch("sharesBlanketWithPartner") === val
                      ? "border-ring bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:border-ring/50"
                  }`}
                >
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bedtime wear */}
        <div>
          <Label className="text-sm font-medium">
            What do you wear to bed?
          </Label>
          <Input
            placeholder="e.g., oversized t-shirt, pajama set, nothing"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("bedtimeWear")}
          />
          {errors.bedtimeWear && (
            <p className="mt-1 text-xs text-red-600">
              {errors.bedtimeWear.message}
            </p>
          )}
        </div>

        {/* Other bedroom uses */}
        <div>
          <Label className="text-sm font-medium">
            Do you use your bedroom for anything besides sleep?
          </Label>
          <Input
            placeholder="e.g., work, TV, meditation, reading"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("bedroomOtherUses")}
          />
          {errors.bedroomOtherUses && (
            <p className="mt-1 text-xs text-red-600">
              {errors.bedroomOtherUses.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

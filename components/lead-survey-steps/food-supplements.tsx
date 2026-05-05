"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { pillStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker";
import { Textarea } from "@/components/ui/textarea";

interface LeadFoodSupplementsProps {
  form: UseFormReturn<FormData>;
}

const CAFFEINE_SOURCES = [
  { id: "coffee", label: "Coffee" },
  { id: "tea", label: "Tea" },
  { id: "pre_workout", label: "Pre-workout" },
  { id: "pills_supplements", label: "Pills / supplements" },
  { id: "other", label: "Other" },
];

const WATER_ADDITIONS = [
  { id: "citrus_juice", label: "Citrus juice" },
  { id: "honey_maple", label: "Honey or maple syrup" },
  { id: "sea_salt", label: "Sea salt" },
  { id: "trace_minerals", label: "Trace minerals" },
  { id: "other", label: "Other" },
];

const DAILY_SUPPLEMENT_OPTIONS = [
  "Magnesium",
  "Vitamin D3",
  "Vitamin K2",
  "Vitamin E",
  "Vitamin A",
  "Trace Minerals",
  "Omega-3 Fatty Acids",
  "Creatine",
];

const SLEEP_SUPPLEMENT_OPTIONS = [
  "Melatonin",
  "Valerian Root",
  "Apigenin",
  "L-Theanine",
  "5-HTP",
  "Glycine",
  "Chamomile Extract",
  "Magnesium",
  "GABA",
  "Myo-Inositol",
  "Jujube Seed",
  "Hops",
  "Vitamin D3",
  "Iron",
  "Diphenhydramine (e.g. Benadryl, Tylenol PM)",
  "Doxylamine (e.g. NyQuil)",
  "Other",
];

const inputCls =
  "w-full rounded-lg border bg-background px-3 py-1.5 text-xs text-muted-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:text-foreground transition-colors";

export function LeadFoodSupplements({ form }: LeadFoodSupplementsProps) {
  const { register, setValue, watch } = form;

  const firstMealTime = watch("firstMealTime");
  const lastMealTime = watch("lastMealTime");
  const caffeineSources = watch("caffeineSources") || [];
  const waterAdditions = watch("waterAdditions") || [];
  const hasLowNutrientHistory = watch("hasLowNutrientHistory");
  const dailySupplements = watch("dailySupplements") || [];
  const sleepSupplements = watch("sleepSupplements") || [];

  const hasCaffeine = caffeineSources.length > 0;
  const hasCaffeineOther = caffeineSources.includes("other");
  const hasWaterOther = waterAdditions.includes("other");

  function toggleCaffeine(id: string) {
    const next = caffeineSources.includes(id)
      ? caffeineSources.filter((s) => s !== id)
      : [...caffeineSources, id];
    setValue("caffeineSources", next, { shouldDirty: true });
    if (!next.includes("other")) setValue("caffeineSourceOther", undefined, { shouldDirty: true });
    if (next.length === 0) {
      setValue("firstCaffeineTime", undefined, { shouldDirty: true });
      setValue("lastCaffeineTime", undefined, { shouldDirty: true });
    }
  }

  function toggleWater(id: string) {
    const next = waterAdditions.includes(id)
      ? waterAdditions.filter((s) => s !== id)
      : [...waterAdditions, id];
    setValue("waterAdditions", next, { shouldDirty: true });
    if (!next.includes("other")) setValue("waterAdditionOther", undefined, { shouldDirty: true });
  }

  // ── Daily supplement helpers ──
  function isDailySelected(name: string) {
    return dailySupplements.some((s) => s.name === name);
  }

  function toggleDailySupplement(name: string) {
    if (isDailySelected(name)) {
      setValue("dailySupplements", dailySupplements.filter((s) => s.name !== name), { shouldDirty: true });
    } else {
      setValue("dailySupplements", [...dailySupplements, { name, dosage: "", magnesiumForm: "" }], { shouldDirty: true });
    }
  }

  function updateDailyField(name: string, field: "dosage" | "magnesiumForm", value: string) {
    setValue(
      "dailySupplements",
      dailySupplements.map((s) => (s.name === name ? { ...s, [field]: value } : s)),
      { shouldDirty: true }
    );
  }

  // ── Sleep supplement helpers ──
  function isSleepSelected(name: string) {
    return sleepSupplements.some((s) => s.name === name);
  }

  function toggleSleepSupplement(name: string) {
    if (isSleepSelected(name)) {
      setValue("sleepSupplements", sleepSupplements.filter((s) => s.name !== name), { shouldDirty: true });
    } else {
      setValue("sleepSupplements", [...sleepSupplements, { name, dosage: "", magnesiumForm: "", otherDetails: "" }], { shouldDirty: true });
    }
  }

  function updateSleepField(name: string, field: "magnesiumForm" | "otherDetails", value: string) {
    setValue(
      "sleepSupplements",
      sleepSupplements.map((s) => (s.name === name ? { ...s, [field]: value } : s)),
      { shouldDirty: true }
    );
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Food &amp; Supplements
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Meal timing, caffeine, and what you take.
      </p>

      <div className="mt-8 space-y-8">

        {/* ── Meal timing ── */}
        <div>
          <Label className="text-sm font-medium">
            What time was your first and last meal or snack yesterday?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Think about everything you ate or drank (besides water) from when you woke up to when you went to sleep.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
              <Label className="text-xs text-muted-foreground">First meal / snack</Label>
              <TimePicker
                value={firstMealTime}
                onChange={(v) => setValue("firstMealTime", v, { shouldDirty: true })}
                className="bg-background"
              />
              <div>
                <Label className="text-xs text-muted-foreground">What was it?</Label>
                <Input
                  placeholder="e.g., Eggs and toast, coffee"
                  className="mt-1 h-10 rounded-xl text-sm"
                  {...register("firstMealContent")}
                />
              </div>
            </div>
            <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
              <Label className="text-xs text-muted-foreground">Last meal / snack</Label>
              <TimePicker
                value={lastMealTime}
                onChange={(v) => setValue("lastMealTime", v, { shouldDirty: true })}
                className="bg-background"
              />
              <div>
                <Label className="text-xs text-muted-foreground">What was it?</Label>
                <Input
                  placeholder="e.g., Chips, herbal tea"
                  className="mt-1 h-10 rounded-xl text-sm"
                  {...register("lastMealContent")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Caffeine ── */}
        <div>
          <Label className="text-sm font-medium">
            Any of these caffeine sources in the last 3 days?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CAFFEINE_SOURCES.map((s) => {
              const selected = caffeineSources.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleCaffeine(s.id)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {hasCaffeineOther && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Input
                placeholder="Describe other caffeine sources…"
                className="h-12 rounded-xl text-base"
                {...register("caffeineSourceOther")}
              />
            </div>
          )}

          {hasCaffeine && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
              <Label className="text-sm font-medium">
                On your most recent day of consumption, when was your first and last caffeine?
              </Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">First</Label>
                  <div className="mt-1">
                    <TimePicker
                      value={watch("firstCaffeineTime")}
                      onChange={(v) => setValue("firstCaffeineTime", v, { shouldDirty: true })}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Last</Label>
                  <div className="mt-1">
                    <TimePicker
                      value={watch("lastCaffeineTime")}
                      onChange={(v) => setValue("lastCaffeineTime", v, { shouldDirty: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Water additions ── */}
        <div>
          <Label className="text-sm font-medium">
            Do you add any of the following to your drinking water?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {WATER_ADDITIONS.map((w) => {
              const selected = waterAdditions.includes(w.id);
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => toggleWater(w.id)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {w.label}
                </button>
              );
            })}
          </div>

          {hasWaterOther && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Input
                placeholder="What else do you add?"
                className="h-12 rounded-xl text-base"
                {...register("waterAdditionOther")}
              />
            </div>
          )}
        </div>

        {/* ── Past tests ── */}
        <div>
          <Label className="text-sm font-medium">
            Have past tests revealed any low or imbalanced nutrients, minerals, or biochemical markers?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            e.g., low vitamin D, ferritin, B12, magnesium, cortisol, thyroid hormones, etc.
          </p>
          <div className="mt-3 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() =>
                  setValue(
                    "hasLowNutrientHistory",
                    hasLowNutrientHistory === val ? undefined : val,
                    { shouldDirty: true }
                  )
                }
                className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                  hasLowNutrientHistory === val ? pillStyles.selected : pillStyles.unselected
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>

          {hasLowNutrientHistory === true && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Input
                placeholder="e.g., Low vitamin D (2022), low ferritin, elevated cortisol…"
                className="h-12 rounded-xl text-base"
                {...register("lowNutrientHistoryDetails")}
              />
            </div>
          )}
        </div>

        {/* ── Daily supplements — inline-expanding pills ── */}
        <div>
          <Label className="text-sm font-medium">Daily supplements you take regularly</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Select all that apply — tap to add dosage details.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {DAILY_SUPPLEMENT_OPTIONS.map((name) => {
              const selected = isDailySelected(name);
              const entry = dailySupplements.find((s) => s.name === name);

              if (selected && entry) {
                return (
                  <div
                    key={name}
                    className="col-span-2 animate-in slide-in-from-top-1 duration-150 rounded-xl border-2 border-primary/40 bg-primary/5 px-4 py-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{name}</p>
                      <button
                        type="button"
                        onClick={() => toggleDailySupplement(name)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 400mg, 5000 IU)"
                      value={entry.dosage}
                      onChange={(e) => updateDailyField(name, "dosage", e.target.value)}
                      className={inputCls}
                    />
                    {name === "Magnesium" && (
                      <input
                        type="text"
                        placeholder="Form of magnesium (e.g., Glycinate, Citrate)"
                        value={entry.magnesiumForm || ""}
                        onChange={(e) => updateDailyField(name, "magnesiumForm", e.target.value)}
                        className={inputCls}
                      />
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleDailySupplement(name)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium text-left transition-colors ${pillStyles.unselected}`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Sleep supplements — pills only; Magnesium expands for form ── */}
        <div>
          <Label className="text-sm font-medium">
            Supplements you use or have used to help with sleep
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">Select all that apply.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SLEEP_SUPPLEMENT_OPTIONS.map((name) => {
              const selected = isSleepSelected(name);
              const entry = sleepSupplements.find((s) => s.name === name);

              if (selected && name === "Magnesium" && entry) {
                return (
                  <div
                    key={name}
                    className="w-full animate-in slide-in-from-top-1 duration-150 rounded-xl border-2 border-primary/40 bg-primary/5 px-4 py-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{name}</p>
                      <button
                        type="button"
                        onClick={() => toggleSleepSupplement(name)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Form (e.g., Glycinate, L-Threonate, Citrate)"
                      value={entry.magnesiumForm || ""}
                      onChange={(e) => updateSleepField(name, "magnesiumForm", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                );
              }

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleSleepSupplement(name)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? pillStyles.selected : pillStyles.unselected
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Prescription medications ── */}
        <div>
          <Label className="text-sm font-medium">
            Prescription medications or other treatments
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Rx, OTC medications, herbs not listed above — one per line.
          </p>
          <div className="mt-2">
            <Textarea
              rows={4}
              placeholder={"e.g., Lexapro 10mg\nMetformin 500mg\nAshwagandha tincture"}
              {...register("medications")}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

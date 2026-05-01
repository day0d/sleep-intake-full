"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, X, Search } from "lucide-react";
import { FormData } from "@/lib/types";
import { pillStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker";
import { Textarea } from "@/components/ui/textarea";

interface FoodDrinkProps {
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

const PLACEHOLDERS = [
  "e.g., Eggs benedict, orange juice",
  "e.g., Protein bar",
  "e.g., Turkey sandwich, chips",
  "e.g., Ice cream cone"
];

const SUPPLEMENT_LIST = [
  "Vitamin D3", "Vitamin D2", "Magnesium Oxide", "Magnesium Citrate", "Magnesium Glycinate",
  "Magnesium Bisglycinate", "Magnesium L-Threonate", "Fish Oil", "Krill Oil", "Cod Liver Oil",
  "Omega-3 (EPA/DHA)", "General Multivitamin", "Prenatal Multivitamin", "Coenzyme Q10 (CoQ10)",
  "Ubiquinol", "Lactobacillus", "Acidophilus", "Probiotic", "Curcumin", "Turmeric",
  "Trace Minerals", "Vitamin C", "Vitamin B-Complex", "Vitamin B12", "Vitamin B6", "P5P",
  "Calcium", "Melatonin", "Glycine", "Zinc", "Vitamin K1", "Vitamin K2", "Apple Cider Vinegar",
  "Green Tea Extract", "Collagen", "Whey Protein", "Casein Protein", "Soy Protein",
  "Plant Protein", "Ashwagandha", "Ferrous Fumarate", "Ferrous Gluconate", "Fiber Supplements",
  "Psyllium Husk", "Glucosamine", "Chondroitin", "Garlic", "Echinacea", "Vitamin E",
  "Folic Acid", "Folate", "Niacin", "Thiamin", "Riboflavin", "Pyridoxine", "Pantothenic acid",
  "Biotin", "Vitamin A", "Retinol", "Beta-carotene", "Potassium", "Iodine", "Copper",
  "Selenium", "Chromium", "Manganese", "Molybdenum", "Elderberry", "Valerian Root",
  "Saw Palmetto", "Ginkgo Biloba", "Ginseng", "Milk Thistle", "Oregano Oil", "Cranberry Extract",
  "Ginger", "Aloe Vera", "Flaxseed", "Flax Oil", "MCT Oil", "Reishi", "Lion's Mane",
  "Maca Root", "Wheatgrass", "Barley Grass", "Berberine", "Resveratrol", "Quercetin",
  "Alpha Lipoic Acid", "NAC", "CBD", "Grapeseed Extract", "Spirulina", "Chlorella",
  "Green Coffee Bean Extract", "Yohimbine", "Cinnamon Extract", "Black Cumin Seed Oil",
  "Goldenseal", "Horsetail", "Creatine", "BCAAs", "L-Theanine", "L-Arginine", "L-Carnitine",
  "Glutamine", "Beta-Alanine", "Taurine", "Tyrosine", "Citrulline Malate", "Prebiotics",
  "FOS", "Inulin", "Amylase", "Lipase", "Digestive Bitters", "Apple Cider Vinegar Capsules",
  "Coconut Oil Capsules", "Chia Seeds", "Cocoa", "Dark Chocolate Supplements", "Electrolytes",
  "Pre-workout Formulas", "Mass Gainers", "Meal Replacement Powders", "Hyaluronic Acid",
  "Lutein", "Zeaxanthin", "Astaxanthin", "Serrapeptase", "Bromelain", "MSM", "DHEA",
  "Betaine HCl", "GABA",
];

export function FoodDrink({ form }: FoodDrinkProps) {
  const { register, setValue, watch, control } = form;

  const { fields: foodFields, append: appendFood } = useFieldArray({
    control,
    name: "foodLog",
  });

  const {
    fields: supplementFields,
    append: appendSupplement,
    remove: removeSupplement,
  } = useFieldArray({
    control,
    name: "supplements",
  });

  const initialized = useRef(false);
  useEffect(() => {
    if (foodFields.length === 0 && !initialized.current) {
      initialized.current = true;
      appendFood([
        { items: "", mealType: "meal", location: "" },
        { items: "", mealType: "snack", location: "" },
        { items: "", mealType: "meal", location: "" },
        { items: "", mealType: "snack", location: "" },
      ]);
    }
  }, [foodFields.length, appendFood]);

  const caffeineSources = watch("caffeineSources") || [];
  const waterAdditions = watch("waterAdditions") || [];
  const alcoholLast3Days = watch("alcoholLast3Days");
  const alcoholEveningPattern = watch("alcoholEveningPattern");
  const hasLowNutrientHistory = watch("hasLowNutrientHistory");

  const hasCaffeine = caffeineSources.length > 0;
  const hasCaffeineOther = caffeineSources.includes("other");
  const hasWaterOther = waterAdditions.includes("other");

  // Supplement search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const currentSupplementNames = supplementFields.map((f) => {
    const vals = watch(`supplements.${supplementFields.indexOf(f)}.name` as const);
    return vals;
  });
  // Get all current supplement names from the form
  const watchedSupplements = watch("supplements") || [];
  const selectedNames = watchedSupplements.map((s) => s.name);

  const filteredList = SUPPLEMENT_LIST.filter(
    (s) =>
      s.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedNames.includes(s)
  ).slice(0, 8);

  const addSupplement = useCallback(
    (name: string) => {
      appendSupplement({ name, dosage: "" });
      setSearchQuery("");
      setShowDropdown(false);
    },
    [appendSupplement]
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = searchQuery.trim();
      if (!trimmed) return;
      // If exact match in list and not already added, use it; otherwise add as-typed
      const exactMatch = SUPPLEMENT_LIST.find(
        (s) => s.toLowerCase() === trimmed.toLowerCase()
      );
      if (exactMatch && !selectedNames.includes(exactMatch)) {
        addSupplement(exactMatch);
      } else if (!selectedNames.includes(trimmed)) {
        addSupplement(trimmed);
      }
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleCaffeine(id: string) {
    const next = caffeineSources.includes(id)
      ? caffeineSources.filter((s) => s !== id)
      : [...caffeineSources, id];
    setValue("caffeineSources", next, { shouldDirty: true });
    if (!next.includes("other")) {
      setValue("caffeineSourceOther", undefined, { shouldDirty: true });
    }
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
    if (!next.includes("other")) {
      setValue("waterAdditionOther", undefined, { shouldDirty: true });
    }
  }

  function toggleBool(
    field: "alcoholLast3Days" | "alcoholEveningPattern" | "hasLowNutrientHistory",
    val: boolean,
    current: boolean | undefined
  ) {
    setValue(field, current === val ? undefined : val, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Food, drink, supplements</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Caffeine, hydration, and alcohol patterns.
      </p>
      <p className="mt-3 rounded-xl bg-muted px-4 py-3 text-center text-xs text-muted-foreground">
        None of this information will be shared. Answer honestly — it helps build a more accurate picture.
      </p>

      <div className="mt-8 space-y-8">
        {/* Food Log */}
        <div>
          <Label className="text-sm font-medium">
            List everything you ate in the last 24 hours
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">Don&apos;t worry about portion sizes. Group by meals/snacks.</p>

          <div className="mt-4 space-y-4">
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[600px] space-y-3">
                <div className="grid grid-cols-[3fr_2fr] gap-3 px-1">
                  <Label className="text-xs text-muted-foreground">Food/Drink Items</Label>
                  <Label className="text-xs text-muted-foreground">Location</Label>
                </div>

                {foodFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-[3fr_2fr] gap-3">
                    <Input
                      placeholder={PLACEHOLDERS[index] || "e.g., Apple slices"}
                      className="h-12 rounded-xl text-base"
                      {...register(`foodLog.${index}.items` as const)}
                    />
                    <Input
                      placeholder="e.g., home, work"
                      className="h-12 rounded-xl text-base"
                      {...register(`foodLog.${index}.location` as const)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => appendFood({ items: "", mealType: "meal", location: "" })}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Plus className="h-4 w-4" />
              </div>
              Add a line
            </button>
          </div>

          <div className="mt-8">
            <Label className="text-sm font-medium">
              What time was your first and last meal or snack yesterday?
            </Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Think about everything you ate or drank (besides water) from when you woke up to when you went to sleep yesterday.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border bg-muted/20 p-4">
                <Label className="text-xs text-muted-foreground">First meal / snack</Label>
                <div className="mt-2">
                  <TimePicker
                    value={watch("firstMealTime")}
                    onChange={(v) => setValue("firstMealTime", v, { shouldDirty: true })}
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="rounded-xl border bg-muted/20 p-4">
                <Label className="text-xs text-muted-foreground">Last meal / snack</Label>
                <div className="mt-2">
                  <TimePicker
                    value={watch("lastMealTime")}
                    onChange={(v) => setValue("lastMealTime", v, { shouldDirty: true })}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Caffeine */}
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

        {/* Water additions */}
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

        {/* Alcohol */}
        <div>
          <Label className="text-sm font-medium">Did you drink alcohol in the last 3 days?</Label>
          <div className="mt-3 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => toggleBool("alcoholLast3Days", val, alcoholLast3Days)}
                className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                  alcoholLast3Days === val ? pillStyles.selected : pillStyles.unselected
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            In the last 1–2 weeks, have you had alcohol in the evening to wind down or socialize?
          </Label>
          <div className="mt-3 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => toggleBool("alcoholEveningPattern", val, alcoholEveningPattern)}
                className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                  alcoholEveningPattern === val ? pillStyles.selected : pillStyles.unselected
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

        {/* Nutrient / biochemical history */}
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
                onClick={() => toggleBool("hasLowNutrientHistory", val, hasLowNutrientHistory)}
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

        {/* Supplements — searchable card list */}
        <div>
          <Label className="text-sm font-medium">
            Supplements you take regularly
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Search or type a supplement name and press Enter to add it. Add dosage on each card.
          </p>

          {/* Search input */}
          <div className="relative mt-3" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(e.target.value.trim().length > 0);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setShowDropdown(true);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search supplements or type your own…"
                className="h-12 rounded-xl pl-10 text-base"
              />
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 mt-1 w-full rounded-xl border bg-background shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-150">
                {filteredList.length > 0 ? (
                  filteredList.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addSupplement(name);
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors border-b last:border-b-0"
                    >
                      {name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No match — press <kbd className="rounded bg-muted px-1 py-0.5 text-xs font-mono">Enter</kbd> to add &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected supplement cards */}
          {supplementFields.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {supplementFields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative rounded-xl border bg-muted/20 px-4 py-3 pr-10"
                >
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeSupplement(index)}
                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Remove supplement"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Supplement name */}
                  <p className="text-sm font-medium leading-tight pr-2">
                    {watch(`supplements.${index}.name` as const)}
                  </p>

                  {/* Dosage input */}
                  <input
                    type="text"
                    placeholder="Dosage (e.g., 400mg, 5000 IU)"
                    className="mt-2 w-full rounded-lg border bg-background px-3 py-1.5 text-xs text-muted-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:text-foreground transition-colors"
                    {...register(`supplements.${index}.dosage` as const)}
                  />
                </div>
              ))}
            </div>
          )}

          {supplementFields.length === 0 && (
            <p className="mt-3 text-xs text-muted-foreground italic">No supplements added yet.</p>
          )}
        </div>

        {/* Medications / other */}
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

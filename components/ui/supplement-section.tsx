"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Search, X } from "lucide-react";
import { FormData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MEDICATIONS = [
  "Albuterol (Ventolin HFA)",
  "Alprazolam (Xanax)",
  "Amoxicillin",
  "Amphetamine/dextroamphetamine (Adderall, Adderall XR)",
  "Amlodipine (Norvasc)",
  "Aspirin/Clopidogrel",
  "Atomoxetine (Strattera)",
  "Atorvastatin (Lipitor)",
  "Atorvastatin Calcium",
  "Bupropion (Wellbutrin)",
  "Buspirone (Buspar)",
  "Citalopram (Celexa)",
  "Dexmethylphenidate (Focalin)",
  "Duloxetine (Cymbalta)",
  "Escitalopram (Lexapro)",
  "Fluoxetine (Prozac)",
  "Gabapentin (Neurontin)",
  "Guanfacine (Intuniv)",
  "Hydrochlorothiazide (HCTZ)",
  "Hydroxyzine (Atarax/Vistaril)",
  "Ibuprofen (Prescription strength)",
  "Levothyroxine (Synthroid)",
  "Lisdexamfetamine (Vyvanse)",
  "Lisinopril (Prinivil/Zestril)",
  "Losartan (Cozaar)",
  "Metformin (Glucophage)",
  "Methylphenidate (Concerta, Ritalin)",
  "Metoprolol (Toprol XL)",
  "Mirtazapine (Remeron)",
  "Omeprazole (Prilosec)",
  "Pantoprazole Sodium (Protonix)",
  "Paroxetine (Paxil)",
  "Prednisone",
  "Sertraline (Zoloft)",
  "Trazodone (Desyrel/Oleptro)",
  "Venlafaxine (Effexor XR)",
  "Viloxazine (Qelbree)",
];

const SUPPLEMENTS = [
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
  "Betaine HCl", "GABA", "Apigenin", "5-HTP", "Chamomile Extract", "Myo-Inositol",
  "Jujube Seed", "Hops", "Iron", "Diphenhydramine (e.g. Benadryl, Tylenol PM)",
  "Doxylamine (e.g. NyQuil)",
];

export const SUPPLEMENT_AND_MED_LIST = [...SUPPLEMENTS, ...MEDICATIONS].sort();

interface Props {
  form: UseFormReturn<FormData>;
}

export function SupplementSection({ form }: Props) {
  const { register, control, watch, setValue } = form;

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "supplements",
  });

  const watched = watch("supplements") || [];
  const selectedNames = watched.map((s) => s.name);

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filtered = SUPPLEMENT_AND_MED_LIST.filter(
    (s) =>
      s.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedNames.includes(s)
  ).slice(0, 8);

  const addItem = useCallback(
    (name: string) => {
      append({ name, dosage: "", takenForSleep: false });
      setSearchQuery("");
      setShowDropdown(false);
    },
    [append]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = searchQuery.trim();
      if (!trimmed) return;
      const exact = SUPPLEMENT_AND_MED_LIST.find(
        (s) => s.toLowerCase() === trimmed.toLowerCase()
      );
      if (exact && !selectedNames.includes(exact)) addItem(exact);
      else if (!selectedNames.includes(trimmed)) addItem(trimmed);
    }
    if (e.key === "Escape") setShowDropdown(false);
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div>
      <Label className="text-sm font-medium">
        Daily supplements and/or medications
      </Label>
      <p className="mt-1 text-xs text-muted-foreground">
        Search or type a name and press Enter to add it. Add dosage and indicate
        if you&apos;ve taken the supplement to aid sleep.
      </p>

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
            onKeyDown={handleKeyDown}
            placeholder="Search supplements / medications or type your own…"
            className="h-12 rounded-xl pl-10 text-base"
          />
        </div>

        {showDropdown && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border bg-background shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-150">
            {filtered.length > 0 ? (
              filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addItem(name);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors border-b last:border-b-0"
                >
                  {name}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No match — press{" "}
                <kbd className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                  Enter
                </kbd>{" "}
                to add &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {fields.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fields.map((field, index) => {
            const takenForSleep = watch(
              `supplements.${index}.takenForSleep` as const
            );
            return (
              <div
                key={field.id}
                className="relative rounded-xl border bg-muted/20 px-4 py-3 pr-10"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <p className="text-sm font-medium leading-tight pr-2">
                  {watch(`supplements.${index}.name` as const)}
                </p>

                <input
                  type="text"
                  placeholder="Dosage (e.g., 400mg, 5000 IU)"
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-1.5 text-xs text-muted-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:text-foreground transition-colors"
                  {...register(`supplements.${index}.dosage` as const)}
                />

                <label className="mt-2 flex items-center gap-2 text-xs text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!takenForSleep}
                    onChange={(e) =>
                      setValue(
                        `supplements.${index}.takenForSleep`,
                        e.target.checked,
                        { shouldDirty: true }
                      )
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  Taken to help with sleep
                </label>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground italic">
          Nothing added yet.
        </p>
      )}
    </div>
  );
}

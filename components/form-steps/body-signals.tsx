"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { cardStyles } from "@/lib/ui-styles";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BodySignalsProps {
  form: UseFormReturn<FormData>;
}

const INFLAMMATION_SYMPTOMS = [
  { id: "AM joint stiffness", emoji: "🦴" },
  { id: "Brain fog", emoji: "🧠" },
  { id: "Puffy face / eyes", emoji: "💧" },
  { id: "Bloating", emoji: "🫃" },
  { id: "Persistent fatigue", emoji: "😴" },
  { id: "Slow wound healing", emoji: "🩹" },
  { id: "Dry skin", emoji: "🌵" },
];

export function BodySignals({ form }: BodySignalsProps) {
  const { register, setValue, watch } = form;

  const inflammationSymptoms = watch("inflammationSymptoms") || [];

  function toggleSymptom(id: string) {
    const next = inflammationSymptoms.includes(id)
      ? inflammationSymptoms.filter((s) => s !== id)
      : [...inflammationSymptoms, id];
    setValue("inflammationSymptoms", next, { shouldDirty: true });
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Body signals</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Inflammation signs and anything you take regularly.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <Label className="text-sm font-medium">Any of these?</Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {INFLAMMATION_SYMPTOMS.map((s) => {
              const selected = inflammationSymptoms.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSymptom(s.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${
                    selected ? cardStyles.selected : cardStyles.unselected
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-xs font-medium leading-tight">{s.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Supplements or medications you take regularly
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Rx, OTC, vitamins, herbs — one per line.
          </p>
          <div className="mt-2">
            <Textarea
              rows={5}
              placeholder={"e.g., Magnesium glycinate 400mg\nVitamin D3 5000 IU\nLexapro 10mg"}
              {...register("supplementsMeds")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BodySignalsProps {
  form: UseFormReturn<FormData>;
}

export function BodySignals({ form }: BodySignalsProps) {
  const { register } = form;

  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">Body signals</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Anything you take regularly that could affect sleep.
      </p>

      <div className="mt-8">
        <Label className="text-sm font-medium">
          Supplements or medications you take regularly
        </Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Rx, OTC, vitamins, herbs — one per line.
        </p>
        <div className="mt-2">
          <Textarea
            rows={8}
            placeholder={"e.g., Magnesium glycinate 400mg\nVitamin D3 5000 IU\nLexapro 10mg"}
            {...register("supplementsMeds")}
          />
        </div>
      </div>
    </div>
  );
}

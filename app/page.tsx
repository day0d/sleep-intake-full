"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { FormData } from "@/lib/types";
import {
  basicsSchema,
  sleepSetupSchema,
  signalsSchema,
  fullFormSchema,
} from "@/lib/schema";
import { generateSubmissionId } from "@/lib/upload";
import { ProgressBar, SECTION_NAMES } from "@/components/progress-bar";
import { Basics } from "@/components/form-steps/basics";
import { Photos } from "@/components/form-steps/photos";
import { SleepSetup } from "@/components/form-steps/sleep-setup";
import { Signals } from "@/components/form-steps/signals";
import { Booking } from "@/components/form-steps/booking";
import { Button } from "@/components/ui/button";

const TOTAL_STEPS = 5;

// Per-step validation schemas (photos has no required fields)
const STEP_SCHEMAS = [basicsSchema, null, sleepSetupSchema, signalsSchema, null];

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [submissionId] = useState(() => generateSubmissionId());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      photoUrls: {},
      videoUrl: undefined,
      phoneLocation: "",
      itemsOwned: [],
      blueLightGlassesColor: undefined,
      sharesBedWithPartner: undefined as unknown as boolean,
      sharesBlanketWithPartner: undefined,
      bedtimeWear: "",
      bedroomOtherUses: "",
      sleepSignals: [],
      sweatingShivering: undefined as unknown as FormData["sweatingShivering"],
    },
  });

  async function validateCurrentStep(): Promise<boolean> {
    const schema = STEP_SCHEMAS[step];
    if (!schema) return true;

    const values = form.getValues();
    const result = await schema.safeParseAsync(values);

    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = err.path.join(".") as keyof FormData;
        form.setError(field, { message: err.message });
      });
      return false;
    }
    return true;
  }

  async function handleNext() {
    const valid = await validateCurrentStep();
    if (valid && step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  }

  async function handleSubmit() {
    setSubmitError(null);

    const values = form.getValues();
    const result = fullFormSchema.safeParse(values);
    if (!result.success) {
      setSubmitError("Some required fields are missing. Please go back and check.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, submissionId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      router.push(`/confirmation?name=${encodeURIComponent(values.name)}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const calendarUrl = process.env.NEXT_PUBLIC_NOTION_CALENDAR_URL || "";

  return (
    <main className="min-h-screen bg-background">
      {/* Top navigation bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-sm">
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full bg-foreground/10 p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}

        <ProgressBar
          currentStep={step + 1}
          totalSteps={TOTAL_STEPS}
          sectionName={SECTION_NAMES[step]}
        />

        <div className="w-9" />
      </div>

      {/* Content area — white card */}
      <div className="mx-auto max-w-lg">
        <div className="min-h-[calc(100vh-8rem)] rounded-t-3xl bg-card shadow-sm">
          {step === 0 && <Basics form={form} />}
          {step === 1 && <Photos form={form} submissionId={submissionId} />}
          {step === 2 && <SleepSetup form={form} />}
          {step === 3 && <Signals form={form} />}
          {step === 4 && (
            <Booking
              calendarUrl={calendarUrl}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>

      {/* Bottom navigation bar (not shown on booking step) */}
      {step < 4 && (
        <div className="sticky bottom-0 z-10 border-t border-border bg-card px-4 py-4">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="text-sm font-medium text-foreground underline"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <Button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background hover:bg-foreground/90"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Submit error */}
      {submitError && (
        <div className="fixed bottom-20 left-4 right-4 mx-auto max-w-lg rounded-xl bg-red-50 p-3 text-center text-sm text-red-700 shadow-lg">
          {submitError}
        </div>
      )}
    </main>
  );
}

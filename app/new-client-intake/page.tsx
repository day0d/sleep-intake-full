"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronLeft, Loader2 } from "lucide-react";

import { FormData } from "@/lib/types";
import { basicsSchema, fullFormSchema, sleepScheduleSchema } from "@/lib/schema";
import { generateSubmissionId } from "@/lib/compress";
import { ProgressBar, SECTION_NAMES } from "@/components/progress-bar";
import { Basics } from "@/components/form-steps/basics";
import { SleepSchedule } from "@/components/form-steps/sleep-schedule";
import { Bedroom } from "@/components/form-steps/bedroom";
import { EveningHabits } from "@/components/form-steps/evening-habits";
import { MorningHabits } from "@/components/form-steps/morning-habits";
import { FoodDrink } from "@/components/form-steps/food-drink";
import { Movement } from "@/components/form-steps/movement";
import { Booking } from "@/components/form-steps/booking";

const TOTAL_STEPS = 8;

const STEP_SCHEMAS = [
  basicsSchema, // 0: name + email required
  sleepScheduleSchema, // 1: sleep patterns must total 100%
  null, null, null, null, null, null,
];

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [submissionId] = useState(() => generateSubmissionId());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      sleepSignals: [],
      sleepPatterns: [],
      wakeupTypology: [],
      lyingAwakeState: [],
      itemsOwned: [],
      blueLightGlassesColor: [],
      bedSharers: [],
      bedroomOtherUses: "",
      curtainTypes: [],
      noiseSources: [],
      noiseFrequency: {},
      eveningLightLocation: [],
      eveningLightTone: [],
      eveningDeviceScreen: [],
      eveningScreenTypes: [],
      eveningScreenDimmers: [],
      caffeineSources: [],
      waterAdditions: [],
      supplements: [],
      dailySupplements: [],
      sleepSupplements: [],
      exerciseTypes: [],
      exerciseTiming: [],
      exerciseRecoverySymptoms: [],
    },
  });

  async function validateCurrentStep(): Promise<string | null> {
    const schema = STEP_SCHEMAS[step];
    if (!schema) return null;

    form.clearErrors();
    const values = form.getValues();
    const result = await schema.safeParseAsync(values);

    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = err.path.join(".") as keyof FormData;
        form.setError(field, { message: err.message });
      });
      const fields = new Set(result.error.issues.map((i) => i.path[0]));
      if (fields.has("name") && fields.has("email")) {
        return "Name and email are required.";
      }
      return result.error.issues[0]?.message || "Please complete all required fields.";
    }
    return null;
  }

  async function handleNext() {
    const error = await validateCurrentStep();
    if (error) {
      setStepError(error);
      return;
    }
    setStepError(null);
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  }

  function handleBack() {
    if (step > 0) {
      form.clearErrors();
      setStepError(null);
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  }

  // Called when user clicks "Get report & book session" on the last survey step.
  // Submits the form data (triggers assessment generation + email), then
  // navigates to the booking/calendar step.
  async function handleSubmitAndProceed() {
    setSubmitError(null);

    const values = form.getValues();
    const result = fullFormSchema.safeParse(values);
    if (!result.success) {
      setSubmitError(
        "Name and email are required. Please go back to step 1 and fill them in."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new window.FormData();
      fd.append("formData", JSON.stringify({ ...result.data, submissionId }));

      const res = await fetch("/api/submit", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      setStep(step + 1);
      window.scrollTo(0, 0);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const calendarUrl = process.env.NEXT_PUBLIC_NOTION_CALENDAR_URL || "";
  const isBookingStep = step === TOTAL_STEPS - 1;
  const isLastSurveyStep = step === TOTAL_STEPS - 2;

  return (
    <main className="min-h-screen bg-background">
      {/* Top navigation bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3 shadow-sm">
        {isBookingStep ? (
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
          totalSteps={7}
          sectionName={SECTION_NAMES[step]}
          hideCount={isBookingStep}
        />

        <div className="w-9" />
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-lg">
        <div className="min-h-[calc(100vh-8rem)] rounded-t-3xl bg-card shadow-sm">
          {step === 0 && <Basics form={form} />}
          {step === 1 && <SleepSchedule form={form} />}
          {step === 2 && <Bedroom form={form} />}
          {step === 3 && <EveningHabits form={form} />}
          {step === 4 && <MorningHabits form={form} />}
          {step === 5 && <FoodDrink form={form} />}
          {step === 6 && <Movement form={form} />}
          {step === 7 && (
            <Booking
              calendarUrl={calendarUrl}
              name={form.getValues("name")}
            />
          )}
        </div>
      </div>

      {/* Bottom navigation bar — hidden on booking step */}
      {!isBookingStep && (
        <div className="sticky bottom-0 z-10 border-t border-border bg-card px-4 py-4 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border-2 border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {isLastSurveyStep ? (
              <button
                type="button"
                onClick={handleSubmitAndProceed}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-full border-2 border-red-500 bg-red-500 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 hover:border-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Book Your Sleep Strategy Session"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full border-2 border-foreground bg-foreground px-8 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {(submitError || stepError) && (
        <div className="fixed bottom-20 left-4 right-4 mx-auto max-w-lg rounded-xl bg-red-50 p-3 text-center text-sm text-red-700 shadow-lg">
          {submitError || stepError}
        </div>
      )}
    </main>
  );
}

"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingProps {
  calendarUrl: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  name: string;
  email: string;
}

export function Booking({
  calendarUrl,
  isSubmitting,
  onSubmit,
  name,
  email,
}: BookingProps) {
  return (
    <div className="px-6 py-8">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Almost done! Complete these two steps:
        </h1>
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Step 1: Book your sleep strategy call
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a time below. During this call, we&apos;ll go over your sleep
              report together and come up with a personalized plan to improve
              your sleep.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              src={calendarUrl}
              className="h-[500px] w-full border-0"
              title="Book your discovery call"
            />
          </div>
        </section>

        {/* Step 2 */}
        <section className="rounded-2xl border border-border bg-muted/30 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Step 2: Submit assessment results
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Once you&apos;ve scheduled your call, click below to submit your
              assessment and receive your free sleep report.
            </p>
          </div>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full rounded-full bg-red-600 py-6 text-base font-semibold text-white shadow-lg transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit to receive your free sleep report"
            )}
          </Button>
        </section>
      </div>
    </div>
  );
}

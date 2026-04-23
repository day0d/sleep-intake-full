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
      <h1 className="text-center text-2xl font-bold text-foreground">
        Book your free discovery call
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Book a time below, then tap submit to receive your free sleep
        environment report.
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <iframe
          src={calendarUrl}
          className="h-[500px] w-full border-0"
          title="Book your discovery call"
        />
      </div>

      <div className="mt-6">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full rounded-full bg-red-600 py-6 text-base font-semibold text-white shadow-lg hover:bg-red-700"
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
      </div>
    </div>
  );
}

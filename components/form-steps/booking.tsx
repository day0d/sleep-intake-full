"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingProps {
  calendarUrl: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function Booking({ calendarUrl, isSubmitting, onSubmit }: BookingProps) {
  return (
    <div className="px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Last step — book your free discovery call
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Once you&apos;re booked, your submission comes straight to me.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
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
          className="w-full rounded-full bg-foreground py-6 text-base font-semibold text-background hover:bg-foreground/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "I\u2019ve booked \u2014 submit my intake"
          )}
        </Button>
      </div>
    </div>
  );
}

"use client";

interface BookingProps {
  calendarUrl: string;
  name: string;
}

export function Booking({ calendarUrl, name }: BookingProps) {
  return (
    <div className="px-6 py-8">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {name ? `One last step, ${name.split(" ")[0]}!` : "One last step!"}
        </h1>
        <p className="text-base text-foreground/80 font-medium">
          Book your free sleep strategy call to receive your personalized sleep report.
        </p>
        <p className="text-sm text-muted-foreground">
          We&apos;ll send your report before the call so you can look it over — then we&apos;ll
          walk through it together, dig deeper into what&apos;s driving your sleep issues, and
          build a personalized plan to actually fix them.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <iframe
          src={calendarUrl}
          className="h-[500px] w-full border-0"
          title="Book your sleep strategy call"
        />
      </div>
    </div>
  );
}

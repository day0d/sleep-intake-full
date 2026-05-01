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
          Book your Sleep Strategy Session below.
        </p>
        <p className="text-sm text-muted-foreground">
          We&apos;ll use your intake to go deep — uncovering what&apos;s driving your sleep issues
          and building a personalized plan with supplements, behavioral protocols, and sleep
          environment redesign.
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

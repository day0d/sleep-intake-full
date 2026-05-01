interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  sectionName: string;
  hideCount?: boolean;
}

const SECTION_NAMES = [
  "The Basics",
  "Sleep Schedule",
  "Sleep Quality",
  "Your Bedroom",
  "Evening Habits",
  "Morning Habits",
  "Food, Drink, Supplements",
  "Movement",
  "Book a Call",
];

export function ProgressBar({
  currentStep,
  totalSteps,
  sectionName,
  hideCount = false,
}: ProgressBarProps) {
  const filledCount = hideCount ? 0 : Math.max(currentStep - 1, 0);
  const emptyCount = hideCount ? 0 : Math.max(totalSteps - currentStep, 0);

  return (
    <div className="flex items-center gap-1.5">
      {/* Filled circles — pages already completed */}
      {Array.from({ length: filledCount }).map((_, i) => (
        <div
          key={`filled-${i}`}
          className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-foreground"
        />
      ))}

      {/* Current page card */}
      <div className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5">
        <span className="text-xs font-medium text-background">{sectionName}</span>
        {!hideCount && (
          <span className="text-xs text-background/60">
            {currentStep} of {totalSteps}
          </span>
        )}
      </div>

      {/* Empty circles — pages remaining */}
      {Array.from({ length: emptyCount }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-foreground bg-background"
        />
      ))}
    </div>
  );
}

export { SECTION_NAMES };

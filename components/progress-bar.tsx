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
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5">
      <span className="text-xs font-medium text-background">{sectionName}</span>
      {!hideCount && (
        <span className="text-xs text-background/60">
          {currentStep} of {totalSteps}
        </span>
      )}
    </div>
  );
}

export { SECTION_NAMES };

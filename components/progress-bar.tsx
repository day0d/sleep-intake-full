interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  sectionName: string;
}

const SECTION_NAMES = [
  "The Basics",
  "Your Space",
  "Sleep Setup",
  "Sleep Signals",
  "Book a Call",
];

export function ProgressBar({
  currentStep,
  totalSteps,
  sectionName,
}: ProgressBarProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5">
      <span className="text-xs font-medium text-background">{sectionName}</span>
      <span className="text-xs text-background/60">
        {currentStep} of {totalSteps}
      </span>
    </div>
  );
}

export { SECTION_NAMES };

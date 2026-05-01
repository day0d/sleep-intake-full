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
        
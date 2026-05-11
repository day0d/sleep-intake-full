"use client";

interface MinuteScrollOption {
  value: number;
  label: string;
}

interface MinuteScrollProps {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  /** Defaults to 0/15/30/45/60 with "in bed" as the special -1 sentinel option. */
  options?: MinuteScrollOption[];
  /** When true, prepend a special "In bed" option that maps to -1. */
  includeInBed?: boolean;
  className?: string;
}

const DEFAULT_OPTIONS: MinuteScrollOption[] = [
  { value: 0, label: "Right away (0m)" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hr" },
];

const IN_BED_VALUE = -1;

export function MinuteScroll({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  includeInBed = false,
  className = "",
}: MinuteScrollProps) {
  const allOptions: MinuteScrollOption[] = includeInBed
    ? [{ value: IN_BED_VALUE, label: "In bed" }, ...options]
    : options;

  return (
    <div
      className={`max-h-44 overflow-y-auto rounded-xl border bg-background ${className}`}
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="flex flex-col">
        {allOptions.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(selected ? undefined : opt.value)}
              className={`px-4 py-2.5 text-left text-sm transition-colors border-b last:border-b-0 ${
                selected
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { IN_BED_VALUE };

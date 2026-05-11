"use client";

import { pillStyles } from "@/lib/ui-styles";

interface ScorePickerProps {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  min?: number;
  max?: number;
}

export function ScorePicker({
  value,
  onChange,
  min = 0,
  max = 10,
}: ScorePickerProps) {
  const items: number[] = [];
  for (let i = min; i <= max; i++) items.push(i);
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((n) => {
        const selected = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(selected ? undefined : n)}
            className={`min-w-[36px] rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-colors ${
              selected ? pillStyles.selected : pillStyles.unselected
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

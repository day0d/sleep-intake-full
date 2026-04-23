"use client";

import { pillStyles } from "@/lib/ui-styles";

export interface PillOption<T extends string = string> {
  id: T;
  label: string;
}

interface PillRowProps<T extends string> {
  options: readonly PillOption<T>[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  /** If true, clicking the selected pill clears the value. Defaults to true. */
  toggleOff?: boolean;
  className?: string;
}

export function PillRow<T extends string>({
  options,
  value,
  onChange,
  toggleOff = true,
  className = "",
}: PillRowProps<T>) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() =>
              onChange(selected && toggleOff ? undefined : opt.id)
            }
            className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
              selected ? pillStyles.selected : pillStyles.unselected
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

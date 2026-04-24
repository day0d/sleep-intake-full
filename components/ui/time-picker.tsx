"use client";

import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

const MINUTES = [
  { value: 0, label: "00" },
  { value: 15, label: "15" },
  { value: 30, label: "30" },
  { value: 45, label: "45" },
];

const PERIODS = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

function parseTime(val?: string) {
  if (!val) return { h: 12, m: 0, period: "AM" };
  const [hStr, mStr] = val.split(":");
  const h24 = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return { h: h12, m, period };
}

function formatTime(h: number, m: number, period: string) {
  let h24 = h;
  if (period === "PM" && h !== 12) h24 += 12;
  if (period === "AM" && h === 12) h24 = 0;
  return `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function TimePicker({ value, onChange, className = "" }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { h, m, period } = parseTime(value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Initial selection if value is empty and user opens it
  function handleOpen() {
    setIsOpen(!isOpen);
    if (!isOpen && !value) {
      // Default to 12:00 AM if no time selected yet
      onChange(formatTime(12, 0, "AM"));
    }
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-4 py-2 text-base transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span className={value ? "text-foreground font-medium" : "text-muted-foreground"}>
          {value ? `${h}:${String(m).padStart(2, "0")} ${period}` : "Select time"}
        </span>
        <Clock className="h-5 w-5 text-muted-foreground opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 flex h-48 w-full min-w-[240px] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg animate-in fade-in zoom-in-95">
          <div className="flex w-full divide-x divide-border">
            <ScrollColumn
              items={HOURS}
              selected={h}
              onSelect={(newH) => onChange(formatTime(newH as number, m, period))}
            />
            <ScrollColumn
              items={MINUTES}
              selected={m}
              onSelect={(newM) => onChange(formatTime(h, newM as number, period))}
            />
            <ScrollColumn
              items={PERIODS}
              selected={period}
              onSelect={(newP) => onChange(formatTime(h, m, newP as string))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ScrollColumn({
  items,
  selected,
  onSelect,
}: {
  items: { value: string | number; label: string }[];
  selected: string | number;
  onSelect: (val: string | number) => void;
}) {
  return (
    <div
      className="flex-1 overflow-y-auto p-1 text-center"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {items.map((item) => {
        const isSelected = item.value === selected;
        return (
          <button
            key={item.value}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item.value);
            }}
            className={`flex w-full items-center justify-center rounded-lg py-2.5 text-sm transition-colors ${
              isSelected
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

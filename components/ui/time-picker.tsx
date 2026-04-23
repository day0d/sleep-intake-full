"use client";

import { forwardRef } from "react";

interface TimePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  function TimePicker({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        type="time"
        step={900}
        className={`h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
        {...props}
      />
    );
  }
);

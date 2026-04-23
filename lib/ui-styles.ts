/**
 * Shared UI style constants for consistent button/card states across all form pages.
 */

/** Card-style toggle buttons (grid items with emoji + label) */
export const cardStyles = {
  selected: "border-foreground bg-foreground text-background",
  unselected: "border-border bg-card text-foreground hover:border-foreground/30",
} as const;

/** Pill-style toggle buttons (rounded pills in a row) */
export const pillStyles = {
  selected: "border-foreground bg-foreground text-background",
  unselected: "border-border bg-card text-foreground hover:border-foreground/30",
} as const;

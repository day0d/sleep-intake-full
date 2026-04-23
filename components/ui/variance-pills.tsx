"use client";

import { PillRow } from "./pill-row";
import { Variance } from "@/lib/types";

const VARIANCE_OPTIONS = [
  { id: "consistent" as const, label: "Very consistent" },
  { id: "some" as const, label: "Some variance" },
  { id: "a_lot" as const, label: "Varies a lot" },
];

interface VariancePillsProps {
  value: Variance | undefined;
  onChange: (value: Variance | undefined) => void;
}

export function VariancePills({ value, onChange }: VariancePillsProps) {
  return <PillRow options={VARIANCE_OPTIONS} value={value} onChange={onChange} />;
}

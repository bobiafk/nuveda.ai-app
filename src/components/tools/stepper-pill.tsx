"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface StepperPillProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
}

export function StepperPill({
  label,
  value,
  min = 1,
  max = 10,
  step = 1,
  unit,
  onChange,
  className,
}: StepperPillProps) {
  const decrement = () => onChange(Math.max(min, +(value - step).toFixed(10)));
  const increment = () => onChange(Math.min(max, +(value + step).toFixed(10)));

  const displayValue = Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">{label}</Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {displayValue}
            {unit}
          </span>
        </div>
      )}
      <div className="flex h-9 w-fit items-center rounded-full border border-border bg-input/50">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        >
          <Minus size={12} strokeWidth={2.5} />
        </button>
        <span className="min-w-9 text-center text-xs font-medium tabular-nums">
          {displayValue}
          {unit}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        >
          <Plus size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

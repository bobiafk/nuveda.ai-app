"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { type LucideIcon } from "lucide-react";

export const ASPECT_SHAPES: Record<string, string> = {
  "1:1": "w-[13px] h-[13px]",
  "16:9": "w-[22px] h-[12px]",
  "9:16": "w-[12px] h-[22px]",
  "4:3": "w-[18px] h-[14px]",
  "3:4": "w-[14px] h-[18px]",
  "3:2": "w-[18px] h-[12px]",
  "2:3": "w-[12px] h-[18px]",
  "21:9": "w-[24px] h-[10px]",
};

export interface PillOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  shapeClass?: string;
}

interface IconPillSelectorProps {
  label?: string;
  options: PillOption[];
  value: string;
  onChange: (value: string) => void;
  columns?: number;
  className?: string;
}

export function IconPillSelector({
  label,
  options,
  value,
  onChange,
  columns,
  className,
}: IconPillSelectorProps) {
  const isTextOnly = options.every((o) => !o.icon && !o.shapeClass);

  // ── Text-only → rounded-full chip wrap ──────────────────────────────
  if (isTextOnly) {
    return (
      <div className={cn("space-y-2.5", className)}>
        {label && <Label className="text-xs font-medium">{label}</Label>}
        <div className="flex flex-wrap gap-1.5">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold leading-none transition-all duration-150 border select-none outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  isSelected
                    ? [
                        "bg-primary text-primary-foreground border-primary",
                        "shadow-[0_0_10px_-2px_var(--color-primary)] shadow-primary/35",
                      ]
                    : [
                        "bg-white/4 text-muted-foreground border-white/10",
                        "hover:bg-white/8 hover:border-white/22 hover:text-foreground",
                        "active:scale-95",
                      ],
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Icon / shape options → fixed-column grid ────────────────────────
  const cols =
    columns ??
    (options.length <= 3
      ? options.length
      : options.length <= 4
        ? 4
        : options.length <= 6
          ? 3
          : 4);

  return (
    <div className={cn("space-y-2.5", className)}>
      {label && <Label className="text-xs font-medium">{label}</Label>}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 px-2 text-[10px] font-semibold leading-none transition-all duration-150 select-none outline-none border focus-visible:ring-2 focus-visible:ring-ring/50",
                isSelected
                  ? [
                      "bg-primary text-primary-foreground border-primary",
                      "shadow-[0_0_12px_-2px_var(--color-primary)] shadow-primary/40",
                    ]
                  : [
                      "bg-white/4 border-white/10 text-muted-foreground",
                      "hover:bg-white/8 hover:border-white/20 hover:text-foreground",
                      "active:scale-[0.97]",
                    ],
              )}
            >
              {!isSelected && (
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-linear-to-b from-white/4 to-transparent" />
              )}
              {opt.shapeClass && (
                <div
                  className={cn(
                    "rounded-xs border shrink-0 transition-colors duration-150",
                    isSelected ? "border-white/70" : "border-current",
                    opt.shapeClass,
                  )}
                />
              )}
              {Icon && !opt.shapeClass && (
                <Icon
                  size={13}
                  className={cn(
                    "shrink-0 transition-transform duration-150",
                    !isSelected && "group-hover:scale-110",
                  )}
                />
              )}
              <span className="tracking-wide">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

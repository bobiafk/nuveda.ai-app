"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradientIconProps {
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  size?: "sm" | "md" | "lg";
  variant?: "filled" | "ghost";
  className?: string;
}

const sizeMap = {
  sm: { wrapper: "h-8 w-8", icon: 14 },
  md: { wrapper: "h-10 w-10", icon: 18 },
  lg: { wrapper: "h-12 w-12", icon: 22 },
};

export function GradientIcon({
  icon: Icon,
  gradientFrom,
  gradientTo,
  size = "md",
  variant = "filled",
  className,
}: GradientIconProps) {
  const s = sizeMap[size];

  if (variant === "ghost") {
    return (
      <div
        className={cn(
          "rounded-lg flex items-center justify-center shrink-0",
          s.wrapper,
          className
        )}
        style={{ backgroundColor: `color-mix(in oklch, ${gradientFrom} 12%, transparent)` }}
      >
        <Icon
          size={s.icon}
          strokeWidth={1.75}
          style={{ color: gradientFrom }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-black/10",
        s.wrapper,
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <Icon size={s.icon} className="text-white" />
    </div>
  );
}

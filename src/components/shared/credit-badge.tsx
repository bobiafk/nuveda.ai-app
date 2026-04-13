"use client";

import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditBadgeProps {
  credits: number;
  maxCredits?: number;
  size?: "sm" | "md";
  className?: string;
}

export function CreditBadge({
  credits,
  maxCredits,
  size = "md",
  className,
}: CreditBadgeProps) {
  const percentage = maxCredits ? (credits / maxCredits) * 100 : null;
  const isLow = percentage !== null && percentage < 20;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border border-white/10 glass",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        isLow && "border-red-400/30",
        className
      )}
    >
      <Coins
        size={size === "sm" ? 12 : 14}
        className={cn(
          "text-primary",
          isLow && "text-destructive"
        )}
      />
      <span className="font-medium tabular-nums">
        {credits.toLocaleString()}
      </span>
      {maxCredits && (
        <span className="text-muted-foreground">
          / {maxCredits.toLocaleString()}
        </span>
      )}
    </div>
  );
}

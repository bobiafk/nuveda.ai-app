"use client";

import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
}

export function GlowCard({
  children,
  glowColor,
  className,
  onClick,
}: GlowCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl glass border border-border p-5 transition-all duration-300",
        "hover:border-white/15 hover:bg-white/8",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={
        glowColor
          ? ({
              "--glow": glowColor,
            } as React.CSSProperties)
          : undefined
      }
    >
      {glowColor && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}15, transparent 40%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

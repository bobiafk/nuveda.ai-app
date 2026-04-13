"use client";

import Link from "next/link";
import { ArrowRight, Coins } from "lucide-react";
import { type Feature } from "@/lib/features";
interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const FeatureIcon = feature.icon;
  return (
    <Link href={feature.route}>
      <div className="group relative rounded-2xl glass-card border border-border p-5 transition-all duration-300 hover:border-border/80 overflow-hidden">
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <FeatureIcon
              size={24}
              strokeWidth={1.75}
              style={{ color: feature.gradientFrom }}
            />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins size={11} />
              <span className="tabular-nums">{feature.creditCost}</span>
            </div>
          </div>

          <h3 className="text-sm font-semibold mb-1.5 group-hover:text-foreground transition-colors">
            {feature.name}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {feature.description}
          </p>

          <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1 duration-300">
            <span>Open tool</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  );
}

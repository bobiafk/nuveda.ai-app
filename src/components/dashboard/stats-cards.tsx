"use client";

import { Coins, Layers, Clock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
}

function StatCard({ label, value, subtitle, icon: Icon, gradientFrom, gradientTo }: StatCardProps) {
  return (
    <div className="relative rounded-2xl glass border border-border p-5 overflow-hidden group hover:border-white/15 transition-colors">
      <div
        className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.10] transition-opacity"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}20)`,
            }}
          >
            <Icon
              size={15}
              style={{ color: gradientFrom }}
            />
          </div>
        </div>
        <div className="text-2xl font-bold tracking-tight font-[family-name:var(--font-display)]">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export function StatsCards() {
  const stats: StatCardProps[] = [
    {
      label: "Credits Remaining",
      value: "847",
      subtitle: "42% of monthly allocation",
      icon: Coins,
      gradientFrom: "#8B5CF6",
      gradientTo: "#3B82F6",
    },
    {
      label: "Generations Today",
      value: "23",
      subtitle: "+12% from yesterday",
      icon: Layers,
      gradientFrom: "#10B981",
      gradientTo: "#14B8A6",
    },
    {
      label: "Queue Active",
      value: "2",
      subtitle: "Estimated 45s remaining",
      icon: Clock,
      gradientFrom: "#F59E0B",
      gradientTo: "#F97316",
    },
    {
      label: "Current Plan",
      value: "Creator",
      subtitle: "Renews in 18 days",
      icon: Crown,
      gradientFrom: "#EC4899",
      gradientTo: "#D946EF",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

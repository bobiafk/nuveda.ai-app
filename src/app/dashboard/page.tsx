"use client";

import { features } from "@/lib/features";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { FeatureCard } from "@/components/dashboard/feature-card";
import { RecentGenerations } from "@/components/dashboard/recent-generations";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <PageHeader
          title="Welcome back, John"
          subtitle="What will you create today?"
        />
        <div className="mt-4">
          <QuickActions />
        </div>
      </div>

      <StatsCards />

      <div>
        <h2 className="text-base font-semibold font-[family-name:var(--font-display)] mb-4">
          AI Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      <RecentGenerations />
    </div>
  );
}

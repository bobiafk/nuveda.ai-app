"use client";

import { useState } from "react";
import { Check, Coins, TrendingUp, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { tiers } from "@/lib/credits";
import { cn } from "@/lib/utils";

export default function SubscriptionPage() {
  const [currentPlan] = useState("creator");

  return (
    <div className="h-full overflow-y-auto">
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <PageHeader title="Subscription" subtitle="Manage your plan and credits" />

      {/* Credit usage */}
      <div className="rounded-2xl glass border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Coins size={15} className="text-primary" />
              Credit Balance
            </h3>
            <p className="text-xs text-muted-foreground">Your monthly credit allocation resets in 18 days</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
            <Zap size={12} />
            Purchase Extra Credits
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold tabular-nums">847 / 2,000 credits</span>
            <span className="text-muted-foreground">42%</span>
          </div>
          <Progress value={42} className="h-2.5" />

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="rounded-xl bg-input/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Used this month</p>
              <p className="text-lg font-bold tabular-nums">1,153</p>
            </div>
            <div className="rounded-xl bg-input/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Avg. daily usage</p>
              <p className="text-lg font-bold tabular-nums">96</p>
            </div>
            <div className="rounded-xl bg-input/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Efficiency bonus</p>
              <p className="text-lg font-bold tabular-nums flex items-center gap-1">
                1.2x
                <TrendingUp size={14} className="text-green-500" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h3 className="text-base font-semibold font-[family-name:var(--font-display)] mb-4">
          Choose Your Plan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => {
            const isCurrent = tier.id === currentPlan;
            return (
              <div
                key={tier.id}
                className={cn(
                  "relative rounded-2xl border p-5 transition-all",
                  isCurrent
                    ? "bg-primary/10 border-primary/30 glow-frost"
                    : "glass border-border hover:border-white/15"
                )}
              >
                {tier.popular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] gradient-primary text-white border-0">
                    Most Popular
                  </Badge>
                )}

                <div className="mb-4">
                  <h4 className="text-sm font-semibold">{tier.name}</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold tracking-tight font-[family-name:var(--font-display)]">
                      ${tier.price}
                    </span>
                    <span className="text-xs text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tier.credits.toLocaleString()} credits/month
                  </p>
                </div>

                <ul className="space-y-2 mb-5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <Check size={13} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full rounded-xl text-xs",
                    isCurrent
                      ? "gradient-primary text-white border-0 hover:opacity-90"
                      : ""
                  )}
                  variant={isCurrent ? "default" : "outline"}
                  size="sm"
                >
                  {isCurrent ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
}

"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditBadge } from "@/components/shared/credit-badge";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-border glass">
      <div className="flex items-center gap-3 flex-1 md:pl-0 pl-12">
        <div className="relative max-w-sm flex-1 hidden sm:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search tools, history..."
            className="pl-9 h-9 bg-input border-border rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CreditBadge credits={847} maxCredits={2000} size="sm" />

        <Button
          size="sm"
          className="rounded-xl gap-1.5 gradient-primary text-white border-0 hover:opacity-90 transition-opacity"
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">Upgrade</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl relative"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
      </div>
    </header>
  );
}

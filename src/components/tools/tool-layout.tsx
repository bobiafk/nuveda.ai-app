"use client";

import Link from "next/link";
import { ArrowLeft, Coins } from "lucide-react";
import { type Feature } from "@/lib/features";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
interface ToolLayoutProps {
  feature: Feature;
  configPanel: React.ReactNode;
  resultPanel: React.ReactNode;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export function ToolLayout({
  feature,
  configPanel,
  resultPanel,
  onGenerate,
  isGenerating,
}: ToolLayoutProps) {
  return (
    <div className="flex h-full animate-fade-in">
      {/* Config panel */}
      <div className="w-full md:w-95 lg:w-100 shrink-0 border-r border-border flex flex-col overflow-hidden glass-strong">
        <div className="px-5 py-4 border-b border-border">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft size={13} />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-3">
            <feature.icon
              size={24}
              strokeWidth={1.75}
              className="shrink-0"
              style={{ color: feature.gradientFrom }}
            />
            <h1 className="text-lg font-bold tracking-tight font-display">
              {feature.name}
            </h1>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-5 space-y-5">
            {configPanel}
          </div>
        </ScrollArea>

        <div className="shrink-0 p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Coins size={12} />
              <span>Cost: <strong className="text-foreground">{feature.creditCost} credits</strong></span>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">847 remaining</span>
          </div>
          <Button
            className="w-full rounded-xl h-11 font-semibold gradient-primary text-white border-0 hover:opacity-90 transition-opacity"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </div>

      {/* Result panel */}
      <div className="hidden md:flex flex-1 flex-col bg-muted/30">
        <ScrollArea className="flex-1">
          <div className="p-6">
            {resultPanel}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

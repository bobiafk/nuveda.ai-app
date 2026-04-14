"use client";

import Link from "next/link";
import { ArrowLeft, Coins, Sparkles } from "lucide-react";
import { type Feature } from "@/lib/features";
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
    <div className="flex h-full overflow-hidden animate-fade-in">
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
          <div className="p-5 space-y-5">{configPanel}</div>
        </ScrollArea>

        <div className="shrink-0 p-4 border-t border-border space-y-3">
          {/* Credits row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Coins size={12} />
              <span>
                Cost:{" "}
                <strong className="text-foreground">
                  {feature.creditCost} credits
                </strong>
              </span>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              847 remaining
            </span>
          </div>

          {/* Premium Generate button */}
          <button
            className="btn-generate"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                Generating…
              </span>
            ) : (
              <span className="flex items-center gap-2.5">
                <Sparkles size={14} className="opacity-90" />
                Generate
                <span className="flex items-center gap-1 rounded-md bg-white/15 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide">
                  {feature.creditCost}
                </span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Result panel */}
      <div className="hidden md:flex flex-1 min-h-0 flex-col bg-muted/30 overflow-hidden">
        <ScrollArea className="flex-1 h-full">
          <div className="p-6">{resultPanel}</div>
        </ScrollArea>
      </div>
    </div>
  );
}

"use client";

import { Lightbulb, Zap, Clock } from "lucide-react";
import { type Feature } from "@/lib/features";
import { GenerationResult } from "./generation-result";

interface ToolHistoryPanelProps {
  feature: Feature;
  hasResults?: boolean;
}

const tipsByType: Record<string, string[]> = {
  text: [
    "Be specific and descriptive in your prompts for better results",
    "Try adding style keywords like 'cinematic', 'minimal', or 'vibrant'",
    "Use negative prompts to exclude unwanted elements",
    "Experiment with different models for varied outputs",
  ],
  image: [
    "Upload high-resolution images for the best enhancement",
    "Supported formats: PNG, JPEG, and WebP",
    "Results maintain the original aspect ratio",
  ],
  audio: [
    "Longer audio clips may take more time to process",
    "Clear input audio produces better voice results",
    "Try different emotion presets for varied outputs",
  ],
  video: [
    "Shorter clips process faster and use fewer credits",
    "Higher resolution inputs yield better results",
    "MP4 and WebM formats are supported",
  ],
};

function ToolEmptyState({ feature }: { feature: Feature }) {
  const FeatureIcon = feature.icon;
  const primaryType = feature.inputTypes[0] || "text";
  const tips = tipsByType[primaryType] || tipsByType.text;

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-125 px-6">
      {/* Decorative background rings */}
      <div className="relative mb-10">
        <div
          className="absolute -inset-12 rounded-full opacity-[0.04]"
          style={{
            background: `radial-gradient(circle, ${feature.gradientFrom}, transparent 70%)`,
          }}
        />
        <div
          className="absolute -inset-20 rounded-full opacity-[0.03]"
          style={{
            background: `radial-gradient(circle, ${feature.gradientFrom}, transparent 70%)`,
          }}
        />
        <div
          className="relative h-16 w-16 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: `color-mix(in oklch, ${feature.gradientFrom} 10%, transparent)`,
          }}
        >
          <FeatureIcon
            size={28}
            strokeWidth={1.5}
            style={{ color: feature.gradientFrom }}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-1">Ready to create</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-10">
        Configure your settings on the left and hit Generate. Your results will appear here.
      </p>

      {/* Tips */}
      <div className="w-full max-w-sm rounded-xl border border-border/60 bg-muted/30 px-4 py-3.5">
        <div className="flex items-center gap-2 mb-2.5">
          <Lightbulb size={13} className="opacity-40" />
          <span className="text-xs font-medium text-muted-foreground/60">Tips</span>
        </div>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-snug">
              <span className="shrink-0 mt-1.5 h-1 w-1 rounded-full bg-muted-foreground/30" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 mt-10 pt-6 border-t border-border w-full max-w-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap size={13} className="text-primary" />
          <span>
            <strong className="text-foreground">{feature.creditCost}</strong> credits per generation
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={13} />
          <span>~10-30s processing</span>
        </div>
      </div>
    </div>
  );
}

export function ToolHistoryPanel({
  feature,
  hasResults = false,
}: ToolHistoryPanelProps) {
  if (!hasResults) {
    return <ToolEmptyState feature={feature} />;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">Results</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <GenerationResult
          type="image"
          status="completed"
          color={feature.gradientFrom}
          title="Generation #1"
        />
        <GenerationResult
          type="image"
          status="completed"
          color={feature.gradientFrom}
          title="Generation #2"
        />
        <GenerationResult
          type="image"
          status="processing"
          color={feature.gradientFrom}
        />
      </div>
    </div>
  );
}

"use client";

import { Zap, Clock } from "lucide-react";
import { type Feature } from "@/lib/features";
import { ImageGalleryCard } from "./image-gallery-card";
import { VideoGalleryCard } from "./video-gallery-card";
import { AudioGalleryCard } from "./audio-gallery-card";

export interface GenerationItem {
  id: string;
  status: "completed" | "processing" | "queued" | "failed";
  url?: string | null;
  thumbnailUrl?: string | null;
  prompt?: string;
  duration?: string;
}

interface ToolHistoryPanelProps {
  feature: Feature;
  generations?: GenerationItem[];
  onDelete?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onItemClick?: (item: GenerationItem) => void;
}

const VIDEO_FEATURE_IDS = new Set([
  "ai-avatar-video",
  "kling-motion",
  "video-upscaling",
  "caption-generator",
]);

const AUDIO_FEATURE_IDS = new Set([
  "audio-generation",
  "voice-generation",
  "music-generation",
]);

function EmptyState({ feature }: { feature: Feature }) {
  const FeatureIcon = feature.icon;
  return (
    <div className="flex flex-col items-center justify-center min-h-105 px-6">
      <div className="relative mb-8">
        <div
          className="absolute -inset-10 rounded-full opacity-[0.05]"
          style={{
            background: `radial-gradient(circle, ${feature.gradientFrom}, transparent 70%)`,
          }}
        />
        <div
          className="relative h-14 w-14 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: `color-mix(in oklch, ${feature.gradientFrom} 10%, transparent)`,
          }}
        >
          <FeatureIcon
            size={26}
            strokeWidth={1.5}
            style={{ color: feature.gradientFrom }}
          />
        </div>
      </div>

      <h3 className="text-base font-semibold mb-1.5">No generations yet</h3>
      <p className="text-sm text-muted-foreground text-center max-w-65 mb-8 leading-relaxed">
        Configure your settings and hit Generate. Your results will appear here.
      </p>

      <div className="flex items-center gap-6 pt-5 border-t border-border/60 w-full max-w-65">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Zap size={12} className="text-primary shrink-0" />
          <span>
            <strong className="text-foreground">{feature.creditCost}</strong>{" "}
            credits
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={12} className="shrink-0" />
          <span>~10–30s</span>
        </div>
      </div>
    </div>
  );
}

export function ToolHistoryPanel({
  feature,
  generations = [],
  onDelete,
  onDismiss,
  onItemClick,
}: ToolHistoryPanelProps) {
  if (generations.length === 0) {
    return <EmptyState feature={feature} />;
  }

  const isVideoFeature = VIDEO_FEATURE_IDS.has(feature.id);
  const isAudioFeature = AUDIO_FEATURE_IDS.has(feature.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Results</h3>
        <span className="text-xs text-muted-foreground">
          {generations.length}{" "}
          {generations.length === 1 ? "generation" : "generations"}
        </span>
      </div>

      {isAudioFeature ? (
        <div className="flex flex-col gap-2">
          {generations.map((item) => (
            <AudioGalleryCard
              key={item.id}
              {...item}
              color={feature.gradientFrom}
              onDelete={onDelete}
              onDismiss={onDismiss}
              onClick={() => onItemClick?.(item)}
            />
          ))}
        </div>
      ) : (
        <div
          className={
            isVideoFeature
              ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
              : "grid grid-cols-2 lg:grid-cols-3 gap-3"
          }
        >
          {generations.map((item) =>
            isVideoFeature ? (
              <VideoGalleryCard
                key={item.id}
                {...item}
                color={feature.gradientFrom}
                onDelete={onDelete}
                onDismiss={onDismiss}
                onClick={() => onItemClick?.(item)}
              />
            ) : (
              <ImageGalleryCard
                key={item.id}
                {...item}
                color={feature.gradientFrom}
                onDelete={onDelete}
                onDismiss={onDismiss}
                onClick={() => onItemClick?.(item)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

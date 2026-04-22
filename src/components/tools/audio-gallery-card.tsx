"use client";

import { useState } from "react";
import { Play, Pause, Download, Trash2, Music, X, AudioLines, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AudioGalleryCardProps {
  id: string;
  status: "completed" | "processing" | "queued" | "failed";
  url?: string | null;
  prompt?: string;
  duration?: string;
  color?: string;
  onDelete?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onClick?: () => void;
}

// Pseudo-random waveform heights seeded from id
function waveHeights(seed: string, bars = 32): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffffff;
  return Array.from({ length: bars }, (_, i) => {
    h = (h * 1664525 + 1013904223) & 0xffffffff;
    const base = Math.abs(Math.sin(i * 0.8 + h * 0.0001)) * 0.6 + 0.15;
    return Math.min(1, Math.max(0.1, base));
  });
}

export function AudioGalleryCard({
  id,
  status,
  url,
  prompt,
  duration,
  color = "#8B5CF6",
  onDelete,
  onDismiss,
  onClick,
}: AudioGalleryCardProps) {
  const [playing, setPlaying] = useState(false);
  const isInProgress = status === "processing" || status === "queued";
  const isFailed = status === "failed";
  const isCompleted = !isInProgress && !isFailed;

  const heights = waveHeights(id);
  const playedBars = playing ? Math.floor(heights.length * 0.38) : 0;

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying((p) => !p);
  };

  return (
    <div
      className={cn(
        "group relative w-full rounded-xl border bg-muted/30 transition-all duration-200 overflow-hidden",
        isCompleted
          ? "cursor-pointer border-white/8 hover:border-white/18 hover:bg-white/4 hover:shadow-lg hover:shadow-black/20"
          : "border-border",
      )}
      onClick={() => isCompleted && onClick?.()}
    >
      {isCompleted ? (
        <div className="flex items-center gap-3 px-3.5 py-3">
          {/* Play button */}
          <button
            type="button"
            onClick={togglePlay}
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-150"
            style={{
              backgroundColor: `${color}18`,
              borderColor: `${color}30`,
              color,
            }}
          >
            {playing ? (
              <Pause size={12} className="fill-current" />
            ) : (
              <Play size={12} className="fill-current translate-x-px" />
            )}
          </button>

          {/* Waveform + meta */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {prompt && (
              <p className="text-xs font-medium text-foreground/90 truncate leading-none">
                {prompt}
              </p>
            )}

            {/* Waveform bars */}
            <div className="flex items-center gap-px h-6">
              {heights.map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full shrink-0 transition-colors duration-200"
                  style={{
                    height: `${Math.round(h * 24)}px`,
                    backgroundColor:
                      i < playedBars
                        ? color
                        : `color-mix(in oklch, ${color} 30%, transparent)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Duration + actions */}
          <div className="shrink-0 flex items-center gap-2">
            {duration && (
              <span className="text-[10px] text-muted-foreground tabular-nums font-medium">
                {duration}
              </span>
            )}

            <div
              className="flex items-center gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {url && url !== "#" && (
                <a
                  href={url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                >
                  <Download size={12} />
                </a>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(id)}
                  className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-red-500/15 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : isInProgress ? (
        <div className="relative flex items-center gap-3 px-3.5 py-3 overflow-hidden">
          {/* Shimmer sweep */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/4 to-transparent pointer-events-none" />

          {/* Spinner */}
          <div className="relative shrink-0">
            <div
              className="h-8 w-8 rounded-full border-2 animate-spin"
              style={{ borderColor: `${color}20`, borderTopColor: color }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={10} style={{ color }} className="animate-pulse" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {prompt && (
              <p className="text-xs text-muted-foreground truncate mb-1.5">{prompt}</p>
            )}
            {/* Skeleton waveform */}
            <div className="flex items-center gap-px h-5">
              {Array.from({ length: 32 }, (_, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full animate-pulse"
                  style={{
                    height: `${Math.round((Math.abs(Math.sin(i * 0.9)) * 0.65 + 0.2) * 20)}px`,
                    backgroundColor: `color-mix(in oklch, ${color} 25%, transparent)`,
                    animationDelay: `${(i % 6) * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ background: `${color}18`, color }}
          >
            {status === "queued" ? "In queue" : "Generating…"}
          </span>
          {(onDismiss || onDelete) && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); (onDismiss ?? onDelete)?.(id); }}
              className="shrink-0 flex items-center justify-center rounded-md p-1 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <X size={11} />
            </button>
          )}
        </div>
      ) : isFailed ? (
        <div className="flex items-center gap-3 px-3.5 py-3">
          <AudioLines size={16} className="text-destructive/50 shrink-0" />
          <div className="flex-1 min-w-0">
            {prompt && <p className="text-xs text-muted-foreground truncate">{prompt}</p>}
            <span className="text-[11px] text-destructive/70">Failed</span>
          </div>
          {(onDismiss || onDelete) && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); (onDismiss ?? onDelete)?.(id); }}
              className="shrink-0 flex items-center justify-center rounded-md p-1 text-muted-foreground/60 hover:text-muted-foreground"
            >
              <X size={11} />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center px-3.5 py-4 gap-2 text-muted-foreground/30">
          <Music size={16} />
          <span className="text-xs">No audio</span>
        </div>
      )}
    </div>
  );
}

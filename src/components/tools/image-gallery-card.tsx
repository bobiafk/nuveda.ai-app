"use client";

import { useState } from "react";
import { Download, Trash2, RotateCcw, AlertTriangle, ImageIcon, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageGalleryCardProps {
  id: string;
  status: "completed" | "processing" | "queued" | "failed";
  url?: string | null;
  prompt?: string;
  color?: string;
  onDelete?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onReuse?: (id: string) => void;
  onClick?: () => void;
}

export function ImageGalleryCard({
  id,
  status,
  url,
  prompt,
  color = "#8B5CF6",
  onDelete,
  onDismiss,
  onReuse,
  onClick,
}: ImageGalleryCardProps) {
  const [hovered, setHovered] = useState(false);
  const isInProgress = status === "processing" || status === "queued";
  const isFailed = status === "failed";
  const isCompleted = !isInProgress && !isFailed && !!url;

  return (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-xl border bg-muted/30 transition-all duration-300",
        isCompleted
          ? "cursor-pointer border-white/8 hover:border-white/20 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.02]"
          : isInProgress
            ? "border-border"
            : "border-border",
      )}
      onClick={() => isCompleted && onClick?.()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isCompleted ? (
        <>
          {/* Image */}
          <img
            src={url!}
            alt={prompt ?? ""}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />

          {/* Dual gradient — top + bottom */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300 pointer-events-none",
              "bg-linear-to-b from-black/50 via-transparent to-black/80",
              hovered ? "opacity-100" : "opacity-0",
            )}
          />

          {/* TOP-RIGHT — action buttons */}
          <div
            className={cn(
              "absolute top-2 right-2 flex flex-col gap-1 transition-all duration-300",
              hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1 rounded-lg bg-black/55 px-1 py-1 backdrop-blur-md ring-1 ring-white/10">
              <a
                href={url!}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                title="Download"
              >
                <Download size={12} />
              </a>
              {onReuse && (
                <button
                  type="button"
                  onClick={() => onReuse(id)}
                  className="flex items-center justify-center rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                  title="Reuse settings"
                >
                  <RotateCcw size={12} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(id)}
                  className="flex items-center justify-center rounded-md p-1.5 text-white/70 transition-colors hover:bg-red-500/70 hover:text-white"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>

          {/* BOTTOM — prompt section */}
          {prompt && (
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 p-2.5 transition-all duration-300",
                hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5",
              )}
            >
              <p className="line-clamp-2 text-[10px] leading-snug text-white/85 font-medium">
                {prompt}
              </p>
            </div>
          )}
        </>
      ) : isInProgress ? (
        /* ── Loading state ── */
        <div className="relative flex size-full flex-col items-center justify-center gap-3 px-4 text-center overflow-hidden">
          {/* Pulsing tinted background */}
          <div
            className="absolute inset-0 opacity-[0.07] animate-pulse"
            style={{
              background: `radial-gradient(ellipse at 50% 60%, ${color}, transparent 70%)`,
            }}
          />

          {/* Animated shimmer sweep */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent" />

          {/* Spinner */}
          <div className="relative">
            <div
              className="h-10 w-10 rounded-full border-2 animate-spin"
              style={{
                borderColor: `${color}20`,
                borderTopColor: color,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={12} style={{ color }} className="animate-pulse" />
            </div>
          </div>

          {/* Skeleton prompt lines */}
          {prompt ? (
            <p className="relative line-clamp-2 text-[11px] text-muted-foreground leading-relaxed max-w-[90%]">
              {prompt}
            </p>
          ) : (
            <div className="relative space-y-1.5 w-4/5">
              <div className="h-2 rounded-full bg-white/8 animate-pulse w-full" />
              <div className="h-2 rounded-full bg-white/8 animate-pulse w-3/4 mx-auto" />
            </div>
          )}

          <span
            className="relative rounded-full px-2.5 py-0.5 text-[10px] font-medium"
            style={{ background: `${color}18`, color }}
          >
            {status === "queued" ? "In queue" : "Generating…"}
          </span>
        </div>
      ) : isFailed ? (
        <div className="flex size-full flex-col items-center justify-center gap-2 px-4 text-center">
          <AlertTriangle size={18} className="text-destructive/60" />
          {prompt && (
            <p className="line-clamp-2 text-xs text-muted-foreground">{prompt}</p>
          )}
          <span className="text-[11px] text-destructive/70">Failed</span>
        </div>
      ) : (
        <div className="flex size-full items-center justify-center">
          <ImageIcon size={22} className="text-muted-foreground/20" />
        </div>
      )}

      {/* Dismiss for in-progress or failed */}
      {(isInProgress || isFailed) && (onDismiss || onDelete) && (
        <div
          className="absolute right-1.5 top-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => (onDismiss ? onDismiss(id) : onDelete?.(id))}
            className="flex items-center justify-center rounded-md bg-black/30 p-1 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
          >
            <X size={11} />
          </button>
        </div>
      )}
    </div>
  );
}

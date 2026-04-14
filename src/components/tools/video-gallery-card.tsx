"use client";

import { useState, useRef } from "react";
import { Play, Download, Trash2, Film, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VideoGalleryCardProps {
  id: string;
  status: "completed" | "processing" | "queued" | "failed";
  url?: string | null;
  thumbnailUrl?: string | null;
  prompt?: string;
  duration?: string;
  color?: string;
  onDelete?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onClick?: () => void;
}

export function VideoGalleryCard({
  id,
  status,
  url,
  thumbnailUrl,
  prompt,
  duration,
  color = "#8B5CF6",
  onDelete,
  onDismiss,
  onClick,
}: VideoGalleryCardProps) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInProgress = status === "processing" || status === "queued";
  const isFailed = status === "failed";
  const isCompleted = !isInProgress && !isFailed && (!!url || !!thumbnailUrl);
  const posterOnly = isCompleted && !url && !!thumbnailUrl;

  const handleMouseEnter = () => {
    setHovered(true);
    if (!posterOnly) videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className={cn(
        "group relative aspect-video overflow-hidden rounded-xl border bg-muted/30 transition-all duration-300",
        isCompleted
          ? "cursor-pointer border-white/8 hover:border-white/20 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.01]"
          : "border-border",
      )}
      onClick={() => isCompleted && onClick?.()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isCompleted ? (
        <>
          {/* Media */}
          {posterOnly ? (
            <img
              src={thumbnailUrl!}
              alt={prompt ?? ""}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <video
              ref={videoRef}
              src={url!}
              poster={thumbnailUrl ?? undefined}
              muted
              loop
              playsInline
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )}

          {/* Play button — visible when idle */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
              hovered ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="flex items-center justify-center rounded-full bg-black/45 p-3 ring-1 ring-white/20 backdrop-blur-sm">
              <Play size={14} className="text-white fill-white translate-x-px" />
            </div>
          </div>

          {/* Dual gradient overlay — fades in on hover */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-opacity duration-300",
              "bg-linear-to-b from-black/55 via-transparent to-black/80",
              hovered ? "opacity-100" : "opacity-0",
            )}
          />

          {/* TOP-RIGHT — actions */}
          <div
            className={cn(
              "absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-black/55 px-1 py-1 backdrop-blur-md ring-1 ring-white/10 transition-all duration-300",
              hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {url && (
              <a
                href={url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                title="Download"
              >
                <Download size={12} />
              </a>
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

          {/* BOTTOM — prompt + duration */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 p-2.5 transition-all duration-300",
              hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5",
            )}
          >
            <div className="flex items-end justify-between gap-2">
              {prompt && (
                <p className="line-clamp-2 flex-1 text-[10px] leading-snug text-white/85 font-medium">
                  {prompt}
                </p>
              )}
              {duration && (
                <span className="shrink-0 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm ring-1 ring-white/10">
                  {duration}
                </span>
              )}
            </div>
          </div>

          {/* Duration badge when idle */}
          {duration && (
            <div
              className={cn(
                "absolute bottom-2 right-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm ring-1 ring-white/10 transition-opacity duration-200",
                hovered ? "opacity-0" : "opacity-100",
              )}
            >
              {duration}
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

          {/* Shimmer sweep */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent" />

          {/* Spinner */}
          <div className="relative">
            <div
              className="h-9 w-9 rounded-full border-2 animate-spin"
              style={{ borderColor: `${color}20`, borderTopColor: color }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={11} style={{ color }} className="animate-pulse" />
            </div>
          </div>

          {prompt ? (
            <p className="relative line-clamp-2 text-[11px] text-muted-foreground leading-relaxed max-w-[90%]">
              {prompt}
            </p>
          ) : (
            <div className="relative space-y-1.5 w-4/5">
              <div className="h-2 rounded-full bg-white/8 animate-pulse" />
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
          <Film size={18} className="text-muted-foreground/40" />
          {prompt && <p className="text-xs text-muted-foreground line-clamp-2">{prompt}</p>}
          <span className="text-[11px] text-destructive/70">Failed</span>
        </div>
      ) : (
        <div className="flex size-full items-center justify-center">
          <Film size={22} className="text-muted-foreground/20" />
        </div>
      )}

      {/* Dismiss for in-progress / failed */}
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

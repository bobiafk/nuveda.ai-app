"use client";

import { Download, X, Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { AudioGalleryCard } from "./audio-gallery-card";
import type { GenerationItem } from "./tool-history-panel";
import { cn } from "@/lib/utils";

interface GenerationPreviewModalProps {
  item: GenerationItem | null;
  variant: "image" | "video" | "audio";
  color?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerationPreviewModal({
  item,
  variant,
  color = "#8B5CF6",
  open,
  onOpenChange,
}: GenerationPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (item?.prompt) {
      navigator.clipboard.writeText(item.prompt).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <div
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
            "w-full max-w-[calc(100%-2rem)]",
            variant === "image" ? "sm:max-w-2xl" : variant === "video" ? "sm:max-w-3xl" : "sm:max-w-xl",
            "duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "outline-none"
          )}
          role="dialog"
        >
          <div className="relative rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white/70 backdrop-blur-sm ring-1 ring-white/10 transition-colors hover:bg-black/60 hover:text-white"
            >
              <X size={14} />
            </button>

            {variant === "image" && item.url && (
              <>
                <div className="relative max-h-[70vh] overflow-hidden bg-black/20 flex items-center justify-center">
                  <img
                    src={item.url}
                    alt={item.prompt ?? ""}
                    className="max-h-[70vh] w-full object-contain"
                  />
                </div>
                <div className="p-4 space-y-3">
                  {item.prompt && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.prompt}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <a
                      href={item.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium px-3 py-2 transition-opacity hover:opacity-90"
                    >
                      <Download size={13} />
                      Download
                    </a>
                    {item.prompt && (
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 rounded-xl border border-border text-xs font-medium px-3 py-2 transition-colors hover:bg-muted"
                      >
                        {copied ? (
                          <><Check size={13} className="text-green-500" /> Copied</>
                        ) : (
                          <><Copy size={13} /> Copy prompt</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {variant === "video" && (
              <>
                <div className="relative bg-black overflow-hidden">
                  {item.url ? (
                    <video
                      src={item.url}
                      poster={item.thumbnailUrl ?? undefined}
                      controls
                      autoPlay
                      loop
                      className="w-full max-h-[65vh] object-contain"
                    />
                  ) : item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.prompt ?? ""}
                      className="w-full max-h-[65vh] object-contain"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
                      No preview available
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  {item.prompt && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.prompt}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {item.url && (
                      <a
                        href={item.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium px-3 py-2 transition-opacity hover:opacity-90"
                      >
                        <Download size={13} />
                        Download
                      </a>
                    )}
                    {item.prompt && (
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 rounded-xl border border-border text-xs font-medium px-3 py-2 transition-colors hover:bg-muted"
                      >
                        {copied ? (
                          <><Check size={13} className="text-green-500" /> Copied</>
                        ) : (
                          <><Copy size={13} /> Copy prompt</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {variant === "audio" && (
              <div className="p-4 space-y-3">
                {item.prompt && (
                  <p className="text-sm font-medium leading-relaxed">{item.prompt}</p>
                )}
                <AudioGalleryCard
                  id={item.id}
                  status={item.status}
                  url={item.url ?? undefined}
                  prompt={undefined}
                  duration={item.duration}
                  color={color}
                />
                <div className="flex items-center gap-2 pt-1">
                  {item.url && item.url !== "#" && (
                    <a
                      href={item.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium px-3 py-2 transition-opacity hover:opacity-90"
                    >
                      <Download size={13} />
                      Download
                    </a>
                  )}
                  {item.prompt && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 rounded-xl border border-border text-xs font-medium px-3 py-2 transition-colors hover:bg-muted"
                    >
                      {copied ? (
                        <><Check size={13} className="text-green-500" /> Copied</>
                      ) : (
                        <><Copy size={13} /> Copy prompt</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
}

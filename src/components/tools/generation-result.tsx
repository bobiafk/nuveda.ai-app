"use client";

import { Download, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GenerationResultProps {
  type: "image" | "audio" | "video" | "text";
  status: "completed" | "processing" | "queued";
  title?: string;
  color?: string;
  className?: string;
}

export function GenerationResult({
  type,
  status,
  title,
  color = "#8B5CF6",
  className,
}: GenerationResultProps) {
  if (status === "processing" || status === "queued") {
    return (
      <div
        className={cn(
          "rounded-xl border border-border glass overflow-hidden",
          className
        )}
      >
        <div className="aspect-square bg-input/50 backdrop-blur-sm flex items-center justify-center relative">
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-10 w-10 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${color}40`, borderTopColor: color }}
            />
            <span className="text-xs text-muted-foreground">
              {status === "processing" ? "Generating..." : "In queue..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group rounded-xl border border-border glass overflow-hidden hover:border-white/15 transition-colors",
        className
      )}
    >
      <div
        className="aspect-square flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${color}10, ${color}05)`,
        }}
      >
        <div
          className="h-16 w-16 rounded-2xl opacity-30"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}80)`,
          }}
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg">
            <Download size={14} />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg">
            <ExternalLink size={14} />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg">
            <RotateCcw size={14} />
          </Button>
        </div>
      </div>
      {title && (
        <div className="p-3 border-t border-border">
          <p className="text-xs truncate">{title}</p>
        </div>
      )}
    </div>
  );
}

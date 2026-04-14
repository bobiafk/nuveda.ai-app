"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, X, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  showOptimize?: boolean;
  className?: string;
}

const SAMPLE_OPTIMIZATIONS: Record<string, string> = {
  default:
    " — cinematic lighting, ultra-detailed textures, professional color grading, 8K resolution, award-winning composition, depth of field, photorealistic rendering",
};

function getOptimized(original: string): string {
  const trimmed = original.trim();
  if (!trimmed) return original;
  // Simulate context-aware enhancement
  if (trimmed.toLowerCase().includes("portrait") || trimmed.toLowerCase().includes("person")) {
    return `${trimmed}, soft studio lighting, bokeh background, sharp facial features, skin detail, editorial photography style, 85mm lens, f/1.8 aperture`;
  }
  if (trimmed.toLowerCase().includes("landscape") || trimmed.toLowerCase().includes("nature")) {
    return `${trimmed}, golden hour lighting, volumetric fog, dramatic sky, vivid colors, wide-angle perspective, National Geographic style, hyper-realistic`;
  }
  if (trimmed.toLowerCase().includes("product") || trimmed.toLowerCase().includes("logo")) {
    return `${trimmed}, clean white studio background, professional product lighting, high-end commercial photography, sharp edges, minimalist composition`;
  }
  return trimmed + SAMPLE_OPTIMIZATIONS.default;
}

const DEFAULT_OPTIMIZED =
  "A surreal dreamscape with floating islands — cinematic lighting, ultra-detailed textures, professional color grading, 8K resolution, award-winning composition, depth of field, photorealistic rendering";

export function PromptInput({
  value,
  onChange,
  label = "Prompt",
  placeholder = "Describe what you want to create...",
  showOptimize = true,
  className,
}: PromptInputProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState<string | null>(
    showOptimize ? DEFAULT_OPTIMIZED : null,
  );

  const handleOptimize = async () => {
    if (!value.trim()) return;
    setIsOptimizing(true);
    setOptimizedPrompt(null);
    await new Promise((r) => setTimeout(r, 1600));
    setOptimizedPrompt(getOptimized(value));
    setIsOptimizing(false);
  };

  const handleAccept = () => {
    if (optimizedPrompt) {
      onChange(optimizedPrompt);
    }
    setOptimizedPrompt(null);
  };

  const handleDecline = () => {
    setOptimizedPrompt(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        {showOptimize && (
          <button
            type="button"
            onClick={handleOptimize}
            disabled={isOptimizing || !value.trim()}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium transition-all duration-200",
              "border border-transparent",
              value.trim() && !isOptimizing
                ? "text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/20 cursor-pointer"
                : "text-muted-foreground/40 cursor-not-allowed",
            )}
          >
            {isOptimizing ? (
              <>
                <Loader2 size={10} className="animate-spin" />
                Optimizing…
              </>
            ) : (
              <>
                <Wand2 size={10} />
                Optimize
              </>
            )}
          </button>
        )}
      </div>

      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "min-h-25 resize-none rounded-xl bg-input/50 border-border text-sm transition-opacity duration-200",
            (isOptimizing || (optimizedPrompt && value.trim())) && "opacity-40 pointer-events-none",
          )}
        />

        {/* Optimizing skeleton overlay */}
        {isOptimizing && (
          <div className="absolute inset-0 rounded-xl flex flex-col justify-center items-center gap-2 pointer-events-none">
            <div className="flex items-center gap-2 text-violet-400">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-xs font-medium">Enhancing your prompt…</span>
            </div>
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full bg-violet-500/50 animate-pulse"
                  style={{
                    width: `${[32, 48, 24][i]}px`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accept / Decline panel */}
      {optimizedPrompt && !isOptimizing && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-violet-500/15">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-violet-400">
              <Sparkles size={10} />
              AI-optimized prompt
            </div>
            <button
              type="button"
              onClick={handleDecline}
              className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <X size={12} />
            </button>
          </div>
          <p className="px-3 py-2.5 text-xs text-foreground/80 leading-relaxed">
            {optimizedPrompt}
          </p>
          <div className="flex items-center gap-2 px-3 pb-3">
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-[11px] font-semibold py-1.5 transition-colors"
            >
              <Check size={11} />
              Accept
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-[11px] font-semibold py-1.5 transition-colors"
            >
              <X size={11} />
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

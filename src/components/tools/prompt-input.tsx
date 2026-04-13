"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

export function PromptInput({
  value,
  onChange,
  label = "Prompt",
  placeholder = "Describe what you want to create...",
  showOptimize = true,
  className,
}: PromptInputProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    await new Promise((r) => setTimeout(r, 1500));
    onChange(
      value +
        " — enhanced with cinematic lighting, professional quality, ultra-detailed, 8K resolution"
    );
    setIsOptimizing(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        {showOptimize && value.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px] gap-1 text-primary hover:text-primary"
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <Sparkles size={10} />
            )}
            Optimize with AI
          </Button>
        )}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-25 resize-none rounded-xl bg-input/50 border-border text-sm"
      />
    </div>
  );
}

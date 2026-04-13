"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

const feature = getFeatureById("prompt-optimizer")!;

const modes = [
  { value: "creative", label: "Creative — Artistic and expressive" },
  { value: "precise", label: "Precise — Technical and detailed" },
  { value: "balanced", label: "Balanced — Best of both worlds" },
];

export default function PromptOptimizerPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("balanced");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setOutput(
        `${input} — masterfully composed with cinematic depth of field, volumetric lighting casting dramatic shadows, ultra-detailed textures at 8K resolution, professional color grading with rich contrast, photorealistic rendering with ray-traced reflections, award-winning composition following the golden ratio`
      );
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      feature={feature}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      configPanel={
        <>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Your Prompt</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter the prompt you want to optimize..."
              className="min-h-[120px] resize-none rounded-xl bg-white/5 border-white/10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Optimization Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modes.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      }
      resultPanel={
        output ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                Optimized Prompt
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={handleCopy}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>

            <div className="rounded-xl glass border border-white/10 p-4">
              <p className="text-sm leading-relaxed">{output}</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowRight size={12} />
              <span>Use this optimized prompt in any generation tool for better results</span>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="Enter a prompt to optimize"
            description="Your AI-enhanced prompt will appear here after optimization."
          />
        )
      }
    />
  );
}

"use client";

import { useState } from "react";
import { Cpu, SlidersHorizontal, ChevronUp } from "lucide-react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { IconPillSelector, ASPECT_SHAPES, type PillOption } from "@/components/tools/icon-pill-selector";
import { StepperPill } from "@/components/tools/stepper-pill";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const feature = getFeatureById("image-generation")!;

const SAMPLE_IMAGES: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "A surreal dreamscape with floating islands and aurora borealis" },
  { id: "s1", status: "completed", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80", prompt: "Abstract neon cityscape, digital art" },
  { id: "s2", status: "completed", url: "https://images.unsplash.com/photo-1696446702183-cbd30e087e03?w=600&q=80", prompt: "Cinematic portrait, golden hour" },
  { id: "s3", status: "completed", url: "https://images.unsplash.com/photo-1635776063360-af6b1e8aead4?w=600&q=80", prompt: "Sci-fi landscape, ultra-detailed" },
  { id: "s4", status: "completed", url: "https://images.unsplash.com/photo-1686191129054-c88d3fca3b3a?w=600&q=80", prompt: "Fantasy forest, mystical lighting" },
  { id: "s5", status: "completed", url: "https://images.unsplash.com/photo-1636955779321-819753cd1741?w=600&q=80", prompt: "Futuristic architecture, 8K" },
  { id: "s6", status: "completed", url: "https://images.unsplash.com/photo-1701985494888-c3a7b4b72752?w=600&q=80", prompt: "Dreamy ocean at sunset, photorealistic" },
];

const models = [
  { value: "flux-pro", label: "Flux Pro" },
  { value: "sdxl", label: "Stable Diffusion XL" },
  { value: "dall-e-3", label: "DALL·E 3" },
  { value: "midjourney", label: "Midjourney v6" },
];

const styleOptions: PillOption[] = [
  { value: "photorealistic", label: "Photo" },
  { value: "digital-art", label: "Digital" },
  { value: "anime", label: "Anime" },
  { value: "oil-painting", label: "Oil" },
  { value: "watercolor", label: "Water" },
  { value: "3d-render", label: "3D" },
  { value: "pixel-art", label: "Pixel" },
  { value: "cinematic", label: "Cinema" },
];

const aspectOptions: PillOption[] = [
  { value: "1:1", label: "1:1", shapeClass: ASPECT_SHAPES["1:1"] },
  { value: "16:9", label: "16:9", shapeClass: ASPECT_SHAPES["16:9"] },
  { value: "9:16", label: "9:16", shapeClass: ASPECT_SHAPES["9:16"] },
  { value: "4:3", label: "4:3", shapeClass: ASPECT_SHAPES["4:3"] },
  { value: "3:2", label: "3:2", shapeClass: ASPECT_SHAPES["3:2"] },
];

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState("flux-pro");
  const [style, setStyle] = useState("photorealistic");
  const [aspect, setAspect] = useState("1:1");
  const [seed, setSeed] = useState("");
  const [batchSize, setBatchSize] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_IMAGES);
  const [showNegative, setShowNegative] = useState(false);

  const currentModelLabel = models.find((m) => m.value === model)?.label ?? model;

  const handleGenerate = () => {
    setIsGenerating(true);

    // Add processing placeholders for each batch item
    const newItems: GenerationItem[] = Array.from({ length: batchSize }, (_, i) => ({
      id: `gen-${Date.now()}-${i}`,
      status: "processing" as const,
      prompt,
    }));
    setGenerations((prev) => [...newItems, ...prev]);

    // Simulate completion after delay
    setTimeout(() => {
      setIsGenerating(false);
      setGenerations((prev) =>
        prev.map((g) =>
          newItems.some((n) => n.id === g.id)
            ? { ...g, status: "completed" as const }
            : g,
        ),
      );
    }, 3000);
  };

  const handleDelete = (id: string) => {
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  };

  const handleDismiss = (id: string) => {
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <ToolLayout
      feature={feature}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      configPanel={
        <>
          <PromptInput value={prompt} onChange={setPrompt} />

          {/* Negative prompt — collapsible */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowNegative((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-base leading-none">
                {showNegative ? "−" : "+"}
              </span>
              Negative prompt
            </button>
            {showNegative && (
              <Textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="Things to exclude from the generation..."
                className="min-h-15 resize-none rounded-xl bg-input/50 border-border text-sm"
              />
            )}
          </div>

          {/* Model selector — popover */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Model</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl bg-input/50 border-border h-9 text-xs font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Cpu size={13} className="text-muted-foreground" />
                    {currentModelLabel}
                  </span>
                  <ChevronUp size={13} className="text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="start" side="top" sideOffset={6}>
                <p className="text-[11px] font-medium text-muted-foreground px-2 pb-1.5">
                  Model
                </p>
                <div className="grid gap-0.5">
                  {models.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setModel(m.value)}
                      className={cn(
                        "rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors",
                        model === m.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Style preset — pill grid */}
          <IconPillSelector
            label="Style"
            options={styleOptions}
            value={style}
            onChange={setStyle}
            columns={4}
          />

          {/* Aspect ratio — shape pill grid */}
          <IconPillSelector
            label="Aspect Ratio"
            options={aspectOptions}
            value={aspect}
            onChange={setAspect}
            columns={5}
          />

          {/* Batch size — stepper */}
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Batch Size</Label>
            <StepperPill
              value={batchSize}
              min={1}
              max={4}
              step={1}
              onChange={setBatchSize}
            />
          </div>

          {/* Seed — optional compact input */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-muted-foreground" />
              <Label className="text-xs font-medium">Seed</Label>
            </div>
            <input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Random"
              className="w-28 rounded-lg bg-input/50 border border-border px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/50 transition-colors"
            />
          </div>
        </>
      }
      resultPanel={
        <ToolHistoryPanel
          feature={feature}
          generations={generations}
          onDelete={handleDelete}
          onDismiss={handleDismiss}
        />
      }
    />
  );
}

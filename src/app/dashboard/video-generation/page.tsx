"use client";

import { useState, useCallback } from "react";
import { Cpu, ChevronUp } from "lucide-react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { IconPillSelector, ASPECT_SHAPES, type PillOption } from "@/components/tools/icon-pill-selector";
import { StepperPill } from "@/components/tools/stepper-pill";
import { GenerationPreviewModal } from "@/components/tools/generation-preview-modal";
import {
  MultiReferenceUploader,
  type RefKind,
  type RefItem,
} from "@/components/tools/multi-reference-uploader";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const feature = getFeatureById("video-generation")!;

const SAMPLE_VIDEOS: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "Seedance 2.0 · Omni Reference · 10s · 16:9" },
  {
    id: "s1",
    status: "completed",
    thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    prompt: "Mountain sunrise with drifting clouds and golden reflections on a lake",
    duration: "0:10",
  },
  {
    id: "s2",
    status: "completed",
    thumbnailUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80",
    prompt: "Cinematic ocean wave crashing on rocky coast at dusk",
    duration: "0:07",
  },
  {
    id: "s3",
    status: "completed",
    thumbnailUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    prompt: "Aerial shot of dense pine forest in autumn, slow zoom out",
    duration: "0:12",
  },
  {
    id: "s4",
    status: "completed",
    thumbnailUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    prompt: "Time-lapse of storm clouds rolling over a desert valley",
    duration: "0:08",
  },
];

const models = [
  { value: "seedance-2", label: "Seedance 2.0" },
  { value: "seedance-1-pro", label: "Seedance 1.0 Pro" },
  { value: "seedance-1-lite", label: "Seedance 1.0 Lite" },
];

const modeOptions: PillOption[] = [
  { value: "omni", label: "Omni Reference" },
  { value: "ffl", label: "First Frame Last Frame" },
];

const aspectOptions: PillOption[] = [
  { value: "16:9", label: "16:9", shapeClass: ASPECT_SHAPES["16:9"] },
  { value: "9:16", label: "9:16", shapeClass: ASPECT_SHAPES["9:16"] },
  { value: "1:1", label: "1:1", shapeClass: ASPECT_SHAPES["1:1"] },
  { value: "4:3", label: "4:3", shapeClass: ASPECT_SHAPES["4:3"] },
];

export default function VideoGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("seedance-2");
  const [mode, setMode] = useState("omni");
  const [duration, setDuration] = useState(10);
  const [aspect, setAspect] = useState("16:9");
  const [quantity, setQuantity] = useState(1);
  const [refItems, setRefItems] = useState<RefItem[]>([]);
  const [activeKind, setActiveKind] = useState<RefKind>("image");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_VIDEOS);
  const [selectedItem, setSelectedItem] = useState<GenerationItem | null>(null);

  const currentModelLabel = models.find((m) => m.value === model)?.label ?? model;

  const handleAddRefs = useCallback((kind: RefKind, files: File[]) => {
    const limits: Record<RefKind, number> = { image: 9, video: 3, audio: 3 };
    const existing = refItems.filter((i) => i.kind === kind).length;
    const available = limits[kind] - existing;
    const toAdd = files.slice(0, available);

    const newItems: RefItem[] = toAdd.map((file) => ({
      id: `ref-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      kind,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setRefItems((prev) => [...prev, ...newItems]);
  }, [refItems]);

  const handleRemoveRef = useCallback((id: string) => {
    setRefItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);

    const newItems: GenerationItem[] = Array.from({ length: quantity }, (_, i) => ({
      id: `gen-${Date.now()}-${i}`,
      status: "processing" as const,
      prompt: `${currentModelLabel} · ${mode === "omni" ? "Omni Reference" : "First Frame Last Frame"} · ${duration}s · ${aspect}`,
    }));
    setGenerations((prev) => [...newItems, ...prev]);

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

  const handleDelete = (id: string) => setGenerations((prev) => prev.filter((g) => g.id !== id));
  const handleDismiss = (id: string) => setGenerations((prev) => prev.filter((g) => g.id !== id));

  return (
    <>
      <ToolLayout
        feature={feature}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        configPanel={
          <>
            {/* Multi-type reference uploader */}
            <MultiReferenceUploader
              label="References"
              items={refItems}
              activeKind={activeKind}
              onActiveKindChange={setActiveKind}
              onAdd={handleAddRefs}
              onRemove={handleRemoveRef}
            />

            {/* Prompt */}
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              placeholder="Describe your video… type @ to reference uploaded files"
            />

            {/* Model selector */}
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

            {/* Mode */}
            <IconPillSelector
              label="Mode"
              options={modeOptions}
              value={mode}
              onChange={setMode}
              columns={2}
            />

            {/* Duration slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Duration</Label>
                <span className="text-xs text-muted-foreground tabular-nums">{duration}s</span>
              </div>
              <Slider
                min={5}
                max={15}
                step={1}
                value={[duration]}
                onValueChange={([v]) => setDuration(v)}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground/60">
                <span>5s</span>
                <span>15s</span>
              </div>
            </div>

            {/* Aspect Ratio */}
            <IconPillSelector
              label="Aspect Ratio"
              options={aspectOptions}
              value={aspect}
              onChange={setAspect}
              columns={4}
            />

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Quantity</Label>
              <StepperPill
                value={quantity}
                min={1}
                max={4}
                step={1}
                onChange={setQuantity}
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
            onItemClick={setSelectedItem}
          />
        }
      />
      <GenerationPreviewModal
        variant="video"
        item={selectedItem}
        color={feature.gradientFrom}
        open={!!selectedItem}
        onOpenChange={(open) => { if (!open) setSelectedItem(null); }}
      />
    </>
  );
}

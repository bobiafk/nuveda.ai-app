"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const feature = getFeatureById("image-upscaling")!;

const scaleOptions: PillOption[] = [
  { value: "2x", label: "2×" },
  { value: "4x", label: "4×" },
  { value: "8x", label: "8×" },
];

const SAMPLE_IMAGES: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "4× upscale · cinematic photo · denoise 45%" },
  {
    id: "sample-1",
    status: "completed",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    prompt: "4× upscale · denoise 40%",
  },
  {
    id: "sample-2",
    status: "completed",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
    prompt: "2× upscale · denoise 60%",
  },
  {
    id: "sample-3",
    status: "completed",
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80",
    prompt: "8× upscale · denoise 30%",
  },
  {
    id: "sample-4",
    status: "completed",
    url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    prompt: "4× upscale · denoise 50%",
  },
  {
    id: "sample-5",
    status: "completed",
    url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80",
    prompt: "2× upscale · denoise 45%",
  },
  {
    id: "sample-6",
    status: "completed",
    url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80",
    prompt: "4× upscale · denoise 55%",
  },
];

export default function ImageUpscalingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState("2x");
  const [denoise, setDenoise] = useState([50]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_IMAGES);

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt: `${scale} upscale · denoise ${denoise[0]}%`,
    };
    setGenerations((prev) => [newItem, ...prev]);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerations((prev) =>
        prev.map((g) =>
          g.id === newItem.id ? { ...g, status: "completed" as const } : g,
        ),
      );
    }, 3000);
  };

  const handleDelete = (id: string) =>
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  const handleDismiss = (id: string) =>
    setGenerations((prev) => prev.filter((g) => g.id !== id));

  return (
    <ToolLayout
      feature={feature}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      configPanel={
        <>
          <FileUploadZone
            accept="image"
            label="Upload Image"
            value={file}
            onChange={setFile}
          />

          <IconPillSelector
            label="Scale Factor"
            options={scaleOptions}
            value={scale}
            onChange={setScale}
            columns={3}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Denoise Level</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {denoise[0]}%
              </span>
            </div>
            <Slider
              value={denoise}
              onValueChange={setDenoise}
              min={0}
              max={100}
              step={5}
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

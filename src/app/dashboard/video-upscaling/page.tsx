"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const feature = getFeatureById("video-upscaling")!;

const SAMPLE_UPSCALED: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "Upscale to 4K · interpolated frames" },
  { id: "s1", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80", prompt: "Upscale to 4K · interpolated", duration: "0:12" },
  { id: "s2", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80", prompt: "Upscale to 2K", duration: "0:20" },
  { id: "s3", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", prompt: "Upscale to 4K · interpolated", duration: "0:35" },
  { id: "s4", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", prompt: "Upscale to 1080p", duration: "0:08" },
];

const resolutionOptions: PillOption[] = [
  { value: "1080p", label: "1080p" },
  { value: "2k", label: "2K" },
  { value: "4k", label: "4K" },
];

export default function VideoUpscalingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resolution, setResolution] = useState("1080p");
  const [frameInterpolation, setFrameInterpolation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_UPSCALED);

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt: `Upscale to ${resolution}${frameInterpolation ? " · interpolated" : ""}`,
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
            accept="video"
            label="Upload Video"
            value={file}
            onChange={setFile}
          />

          {/* Resolution pill grid */}
          <IconPillSelector
            label="Target Resolution"
            options={resolutionOptions}
            value={resolution}
            onChange={setResolution}
            columns={3}
          />

          {/* Frame interpolation toggle */}
          <div className="flex items-center justify-between rounded-xl bg-input/50 border border-border p-3">
            <div>
              <Label className="text-xs font-medium">Frame Interpolation</Label>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Smooth motion by generating intermediate frames
              </p>
            </div>
            <Switch
              checked={frameInterpolation}
              onCheckedChange={setFrameInterpolation}
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

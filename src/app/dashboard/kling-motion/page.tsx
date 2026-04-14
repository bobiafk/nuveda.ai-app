"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const feature = getFeatureById("kling-motion")!;

const SAMPLE_VIDEOS: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "Zoom In · Crane · 80% — Mountain timelapse" },
  { id: "s1", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", prompt: "Zoom In · Steadicam · 70%", duration: "0:05" },
  { id: "s2", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80", prompt: "Orbit · Static · 85%", duration: "0:08" },
  { id: "s3", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80", prompt: "Pan L · Dolly · 60%", duration: "0:06" },
  { id: "s4", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", prompt: "Parallax · Crane · 90%", duration: "0:07" },
];

const motionOptions: PillOption[] = [
  { value: "zoom-in", label: "Zoom In" },
  { value: "zoom-out", label: "Zoom Out" },
  { value: "pan-left", label: "Pan L" },
  { value: "pan-right", label: "Pan R" },
  { value: "tilt-up", label: "Tilt Up" },
  { value: "tilt-down", label: "Tilt Dn" },
  { value: "orbit", label: "Orbit" },
  { value: "parallax", label: "Parallax" },
  { value: "custom", label: "Custom" },
];

const cameraOptions: PillOption[] = [
  { value: "static", label: "Static" },
  { value: "dolly", label: "Dolly" },
  { value: "crane", label: "Crane" },
  { value: "handheld", label: "Handheld" },
  { value: "steadicam", label: "Steadicam" },
];

export default function KlingMotionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [motionType, setMotionType] = useState("zoom-in");
  const [intensity, setIntensity] = useState([50]);
  const [camera, setCamera] = useState("static");
  const [duration, setDuration] = useState([3]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_VIDEOS);

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt: `${motionType} · ${camera} · ${intensity[0]}%`,
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

          {/* Motion type */}
          <IconPillSelector
            label="Motion Type"
            options={motionOptions}
            value={motionType}
            onChange={setMotionType}
            columns={3}
          />

          {/* Intensity slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Intensity</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {intensity[0]}%
              </span>
            </div>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              min={10}
              max={100}
              step={5}
            />
          </div>

          {/* Camera movement */}
          <IconPillSelector
            label="Camera Movement"
            options={cameraOptions}
            value={camera}
            onChange={setCamera}
            columns={3}
          />

          {/* Duration slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Duration</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {duration[0]}s
              </span>
            </div>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={1}
              max={10}
              step={0.5}
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

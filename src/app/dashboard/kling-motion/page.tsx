"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel } from "@/components/tools/tool-history-panel";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const feature = getFeatureById("kling-motion")!;

const motionTypes = [
  { value: "pan-left", label: "Pan Left" },
  { value: "pan-right", label: "Pan Right" },
  { value: "zoom-in", label: "Zoom In" },
  { value: "zoom-out", label: "Zoom Out" },
  { value: "orbit", label: "Orbit" },
  { value: "tilt-up", label: "Tilt Up" },
  { value: "tilt-down", label: "Tilt Down" },
  { value: "parallax", label: "Parallax" },
  { value: "custom", label: "Custom Path" },
];

const cameraMovements = [
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

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

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

          <div className="space-y-2">
            <Label className="text-xs font-medium">Motion Type</Label>
            <Select value={motionType} onValueChange={setMotionType}>
              <SelectTrigger className="rounded-xl bg-input/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {motionTypes.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Intensity</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{intensity[0]}%</span>
            </div>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              min={10}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Camera Movement</Label>
            <Select value={camera} onValueChange={setCamera}>
              <SelectTrigger className="rounded-xl bg-input/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cameraMovements.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Duration</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{duration[0]}s</span>
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
      resultPanel={<ToolHistoryPanel feature={feature} />}
    />
  );
}

"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel } from "@/components/tools/tool-history-panel";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const feature = getFeatureById("image-upscaling")!;

const scales = [
  { value: "2x", label: "2x Upscale" },
  { value: "4x", label: "4x Upscale" },
  { value: "8x", label: "8x Upscale" },
];

export default function ImageUpscalingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState("2x");
  const [denoise, setDenoise] = useState([50]);
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
            <Label className="text-xs font-medium">Scale Factor</Label>
            <Select value={scale} onValueChange={setScale}>
              <SelectTrigger className="rounded-xl bg-input/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scales.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Denoise Level</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{denoise[0]}%</span>
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
      resultPanel={<ToolHistoryPanel feature={feature} />}
    />
  );
}

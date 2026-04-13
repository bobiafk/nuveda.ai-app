"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel } from "@/components/tools/tool-history-panel";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const feature = getFeatureById("video-upscaling")!;

const resolutions = [
  { value: "1080p", label: "1080p Full HD" },
  { value: "2k", label: "2K QHD" },
  { value: "4k", label: "4K Ultra HD" },
];

export default function VideoUpscalingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resolution, setResolution] = useState("1080p");
  const [frameInterpolation, setFrameInterpolation] = useState(false);
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
            accept="video"
            label="Upload Video"
            value={file}
            onChange={setFile}
          />

          <div className="space-y-2">
            <Label className="text-xs font-medium">Target Resolution</Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resolutions.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
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
      resultPanel={<ToolHistoryPanel feature={feature} />}
    />
  );
}

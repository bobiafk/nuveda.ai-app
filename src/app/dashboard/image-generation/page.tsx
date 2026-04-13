"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const feature = getFeatureById("image-generation")!;

const models = [
  { value: "flux-pro", label: "Flux Pro" },
  { value: "sdxl", label: "Stable Diffusion XL" },
  { value: "dall-e-3", label: "DALL·E 3" },
  { value: "midjourney", label: "Midjourney v6" },
];

const styles = [
  { value: "photorealistic", label: "Photorealistic" },
  { value: "digital-art", label: "Digital Art" },
  { value: "anime", label: "Anime" },
  { value: "oil-painting", label: "Oil Painting" },
  { value: "watercolor", label: "Watercolor" },
  { value: "3d-render", label: "3D Render" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "cinematic", label: "Cinematic" },
];

const aspects = [
  { value: "1:1", label: "1:1 Square" },
  { value: "16:9", label: "16:9 Landscape" },
  { value: "9:16", label: "9:16 Portrait" },
  { value: "4:3", label: "4:3 Standard" },
  { value: "3:2", label: "3:2 Photo" },
];

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState("flux-pro");
  const [style, setStyle] = useState("photorealistic");
  const [aspect, setAspect] = useState("1:1");
  const [seed, setSeed] = useState("");
  const [batchSize, setBatchSize] = useState([1]);
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
          <PromptInput value={prompt} onChange={setPrompt} />

          <div className="space-y-2">
            <Label className="text-xs font-medium">Negative Prompt</Label>
            <Textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Things to exclude from the generation..."
              className="min-h-[60px] resize-none rounded-xl bg-input/50 border-border text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="rounded-xl bg-input/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Style Preset</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="rounded-xl bg-input/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Aspect Ratio</Label>
            <Select value={aspect} onValueChange={setAspect}>
              <SelectTrigger className="rounded-xl bg-input/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aspects.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Batch Size</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{batchSize[0]}</span>
            </div>
            <Slider
              value={batchSize}
              onValueChange={setBatchSize}
              min={1}
              max={4}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Seed (optional)</Label>
            <Input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Random"
              className="rounded-xl bg-input/50 border-border text-sm"
            />
          </div>
        </>
      }
      resultPanel={<ToolHistoryPanel feature={feature} />}
    />
  );
}

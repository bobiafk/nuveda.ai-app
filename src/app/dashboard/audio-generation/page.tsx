"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const feature = getFeatureById("audio-generation")!;

const voices = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
];

const formats = [
  { value: "mp3", label: "MP3" },
  { value: "wav", label: "WAV" },
  { value: "ogg", label: "OGG" },
  { value: "flac", label: "FLAC" },
];

export default function AudioGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [speed, setSpeed] = useState([1.0]);
  const [format, setFormat] = useState("mp3");
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
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            label="Text to speak"
            placeholder="Enter the text you want to convert to audio..."
          />

          <div className="space-y-2">
            <Label className="text-xs font-medium">Voice</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger className="rounded-xl bg-input/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Speed</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{speed[0].toFixed(1)}x</span>
            </div>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={0.5}
              max={2.0}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Output Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="rounded-xl bg-input/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      }
      resultPanel={<ToolHistoryPanel feature={feature} />}
    />
  );
}

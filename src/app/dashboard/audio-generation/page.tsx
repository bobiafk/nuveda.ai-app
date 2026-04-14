"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const feature = getFeatureById("audio-generation")!;

const SAMPLE_AUDIO: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "Dark cinematic ambient soundscape with deep bass" },
  { id: "s1", status: "completed", url: "#", prompt: "Upbeat electronic background music", duration: "1:24" },
  { id: "s2", status: "completed", url: "#", prompt: "Calm ambient meditation soundtrack", duration: "2:05" },
  { id: "s3", status: "completed", url: "#", prompt: "Epic orchestral cinematic theme", duration: "1:45" },
  { id: "s4", status: "completed", url: "#", prompt: "Jazz piano lounge session", duration: "3:12" },
];

const voiceOptions: PillOption[] = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
];

const formatOptions: PillOption[] = [
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
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_AUDIO);

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt,
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
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            label="Text to speak"
            placeholder="Enter the text you want to convert to audio..."
          />

          {/* Voice selector */}
          <IconPillSelector
            label="Voice"
            options={voiceOptions}
            value={voice}
            onChange={setVoice}
            columns={3}
          />

          {/* Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Speed</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {speed[0].toFixed(1)}×
              </span>
            </div>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={0.5}
              max={2.0}
              step={0.1}
            />
          </div>

          {/* Output format */}
          <IconPillSelector
            label="Output Format"
            options={formatOptions}
            value={format}
            onChange={setFormat}
            columns={4}
          />
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

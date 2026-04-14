"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const feature = getFeatureById("voice-generation")!;

const SAMPLE_VOICES: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "Kai — Welcome to our brand-new product launch experience!" },
  { id: "s1", status: "completed", url: "#", prompt: "Aria — Hello! Welcome to our platform, how can I help you today?", duration: "0:08" },
  { id: "s2", status: "completed", url: "#", prompt: "Marcus — The quarterly results exceeded all expectations this year.", duration: "0:06" },
  { id: "s3", status: "completed", url: "#", prompt: "Luna — Take a deep breath and let your worries fade away.", duration: "0:05" },
  { id: "s4", status: "completed", url: "#", prompt: "Kai — Are you ready to crush your workout today? Let's go!", duration: "0:07" },
  { id: "s5", status: "completed", url: "#", prompt: "Sage — Today's briefing covers three key market developments.", duration: "0:09" },
];

const presetVoices = [
  { value: "aria", label: "Aria — Warm, friendly" },
  { value: "marcus", label: "Marcus — Deep, authoritative" },
  { value: "luna", label: "Luna — Soft, calm" },
  { value: "kai", label: "Kai — Energetic, upbeat" },
  { value: "sage", label: "Sage — Professional, neutral" },
];

const emotionOptions: PillOption[] = [
  { value: "neutral", label: "Neutral" },
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "excited", label: "Excited" },
  { value: "calm", label: "Calm" },
  { value: "serious", label: "Serious" },
];

export default function VoiceGenerationPage() {
  const [text, setText] = useState("");
  const [voiceMode, setVoiceMode] = useState("preset");
  const [presetVoice, setPresetVoice] = useState("aria");
  const [cloneFile, setCloneFile] = useState<File | null>(null);
  const [emotion, setEmotion] = useState("neutral");
  const [speed, setSpeed] = useState([1.0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_VOICES);

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt: text,
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
            value={text}
            onChange={setText}
            label="Text to speak"
            placeholder="Enter the text you want to convert to speech..."
            showOptimize={false}
          />

          <div className="space-y-2">
            <Tabs value={voiceMode} onValueChange={setVoiceMode}>
              <TabsList className="w-full">
                <TabsTrigger value="preset" className="flex-1 text-xs">
                  Preset Voice
                </TabsTrigger>
                <TabsTrigger value="clone" className="flex-1 text-xs">
                  Voice Clone
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preset" className="mt-3">
                <Select value={presetVoice} onValueChange={setPresetVoice}>
                  <SelectTrigger className="rounded-xl bg-input/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {presetVoices.map((v) => (
                      <SelectItem key={v.value} value={v.value}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>
              <TabsContent value="clone" className="mt-3">
                <FileUploadZone
                  accept="audio"
                  value={cloneFile}
                  onChange={setCloneFile}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Emotion */}
          <IconPillSelector
            label="Emotion"
            options={emotionOptions}
            value={emotion}
            onChange={setEmotion}
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

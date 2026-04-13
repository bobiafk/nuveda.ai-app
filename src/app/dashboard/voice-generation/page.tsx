"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const feature = getFeatureById("voice-generation")!;

const presetVoices = [
  { value: "aria", label: "Aria — Warm, friendly" },
  { value: "marcus", label: "Marcus — Deep, authoritative" },
  { value: "luna", label: "Luna — Soft, calm" },
  { value: "kai", label: "Kai — Energetic, upbeat" },
  { value: "sage", label: "Sage — Professional, neutral" },
];

const emotions = [
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
            value={text}
            onChange={setText}
            label="Text to speak"
            placeholder="Enter the text you want to convert to speech..."
            showOptimize={false}
          />

          <div className="space-y-2">
            <Label className="text-xs font-medium">Voice Source</Label>
            <Tabs value={voiceMode} onValueChange={setVoiceMode}>
              <TabsList className="w-full">
                <TabsTrigger value="preset" className="flex-1 text-xs">Preset Voice</TabsTrigger>
                <TabsTrigger value="clone" className="flex-1 text-xs">Voice Clone</TabsTrigger>
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

          <div className="space-y-2">
            <Label className="text-xs font-medium">Emotion</Label>
            <Select value={emotion} onValueChange={setEmotion}>
              <SelectTrigger className="rounded-xl bg-input/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {emotions.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
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
        </>
      }
      resultPanel={<ToolHistoryPanel feature={feature} />}
    />
  );
}

"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const feature = getFeatureById("ai-avatar-video")!;

const SAMPLE_AVATARS: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "New product demo walkthrough script" },
  { id: "s1", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80", prompt: "Product launch announcement script", duration: "0:32" },
  { id: "s2", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", prompt: "Welcome onboarding video", duration: "0:45" },
  { id: "s3", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80", prompt: "Weekly team update presentation", duration: "1:02" },
  { id: "s4", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80", prompt: "Social media promotional clip", duration: "0:28" },
];

const expressionOptions: PillOption[] = [
  { value: "neutral", label: "Neutral" },
  { value: "happy", label: "Happy" },
  { value: "professional", label: "Professional" },
  { value: "excited", label: "Excited" },
  { value: "serious", label: "Serious" },
  { value: "friendly", label: "Friendly" },
];

const backgroundOptions: PillOption[] = [
  { value: "office", label: "Office" },
  { value: "studio", label: "Studio" },
  { value: "nature", label: "Nature" },
  { value: "abstract", label: "Abstract" },
  { value: "transparent", label: "Transparent" },
  { value: "custom", label: "Custom" },
];

export default function AiAvatarVideoPage() {
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState("script");
  const [script, setScript] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [expression, setExpression] = useState("neutral");
  const [background, setBackground] = useState("studio");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_AVATARS);

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt: script || "Avatar video",
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
            label="Avatar Image"
            value={avatarImage}
            onChange={setAvatarImage}
          />

          <div className="space-y-2">
            <Tabs value={inputMode} onValueChange={setInputMode}>
              <TabsList className="w-full">
                <TabsTrigger value="script" className="flex-1 text-xs">
                  Script
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex-1 text-xs">
                  Audio Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="script" className="mt-3">
                <PromptInput
                  value={script}
                  onChange={setScript}
                  label="Script"
                  placeholder="Write the script for the avatar to speak..."
                  showOptimize={false}
                />
              </TabsContent>
              <TabsContent value="audio" className="mt-3">
                <FileUploadZone
                  accept="audio"
                  value={audioFile}
                  onChange={setAudioFile}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Expression */}
          <IconPillSelector
            label="Expression"
            options={expressionOptions}
            value={expression}
            onChange={setExpression}
            columns={3}
          />

          {/* Background */}
          <IconPillSelector
            label="Background"
            options={backgroundOptions}
            value={background}
            onChange={setBackground}
            columns={3}
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

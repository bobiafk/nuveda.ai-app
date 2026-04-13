"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const feature = getFeatureById("ai-avatar-video")!;

const expressions = [
  { value: "neutral", label: "Neutral" },
  { value: "happy", label: "Happy" },
  { value: "professional", label: "Professional" },
  { value: "excited", label: "Excited" },
  { value: "serious", label: "Serious" },
  { value: "friendly", label: "Friendly" },
];

const backgrounds = [
  { value: "office", label: "Office" },
  { value: "studio", label: "Studio" },
  { value: "nature", label: "Nature" },
  { value: "abstract", label: "Abstract" },
  { value: "transparent", label: "Transparent" },
  { value: "custom", label: "Custom Color" },
];

export default function AiAvatarVideoPage() {
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState("script");
  const [script, setScript] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [expression, setExpression] = useState("neutral");
  const [background, setBackground] = useState("studio");
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
            label="Avatar Image"
            value={avatarImage}
            onChange={setAvatarImage}
          />

          <div className="space-y-2">
            <Label className="text-xs font-medium">Input Type</Label>
            <Tabs value={inputMode} onValueChange={setInputMode}>
              <TabsList className="w-full">
                <TabsTrigger value="script" className="flex-1 text-xs">Script</TabsTrigger>
                <TabsTrigger value="audio" className="flex-1 text-xs">Audio Upload</TabsTrigger>
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

          <div className="space-y-2">
            <Label className="text-xs font-medium">Expression</Label>
            <Select value={expression} onValueChange={setExpression}>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {expressions.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Background</Label>
            <Select value={background} onValueChange={setBackground}>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {backgrounds.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
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

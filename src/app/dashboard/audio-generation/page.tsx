"use client";

import { useState } from "react";
import { Plus, Zap } from "lucide-react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { GenerationPreviewModal } from "@/components/tools/generation-preview-modal";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const feature = getFeatureById("audio-generation")!;

const SAMPLE_AUDIO: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "Dark cinematic ambient soundscape with deep bass" },
  { id: "s1", status: "completed", url: "#", prompt: "Upbeat electronic background music", duration: "1:24" },
  { id: "s2", status: "completed", url: "#", prompt: "Calm ambient meditation soundtrack", duration: "2:05" },
  { id: "s3", status: "completed", url: "#", prompt: "Epic orchestral cinematic theme", duration: "1:45" },
  { id: "s4", status: "completed", url: "#", prompt: "Jazz piano lounge session", duration: "3:12" },
];

const defaultVoices: PillOption[] = [
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
  const [voiceTab, setVoiceTab] = useState("voices");
  const [cloneFile, setCloneFile] = useState<File | null>(null);
  const [v3Enhance, setV3Enhance] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_AUDIO);
  const [voices, setVoices] = useState<PillOption[]>(defaultVoices);
  const [selectedItem, setSelectedItem] = useState<GenerationItem | null>(null);

  // Add voice dialog state
  const [addVoiceOpen, setAddVoiceOpen] = useState(false);
  const [newVoiceName, setNewVoiceName] = useState("");
  const [newVoiceFile, setNewVoiceFile] = useState<File | null>(null);

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

  const handleAddVoice = () => {
    if (!newVoiceName.trim()) return;
    const id = `custom-${Date.now()}`;
    setVoices((prev) => [...prev, { value: id, label: newVoiceName.trim() }]);
    setVoice(id);
    setNewVoiceName("");
    setNewVoiceFile(null);
    setAddVoiceOpen(false);
  };

  const handleDelete = (id: string) =>
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  const handleDismiss = (id: string) =>
    setGenerations((prev) => prev.filter((g) => g.id !== id));

  return (
    <>
      <ToolLayout
        feature={feature}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        configPanel={
          <>
            {/* v3 Enhance toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-input/30 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-primary" />
                <Label className="text-xs font-medium cursor-pointer">v3 Enhance</Label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {v3Enhance ? "Auto" : "Off"}
                </span>
                <Switch
                  checked={v3Enhance}
                  onCheckedChange={setV3Enhance}
                />
              </div>
            </div>

            <PromptInput
              value={prompt}
              onChange={setPrompt}
              label="Text to speak"
              placeholder="Enter the text you want to convert to audio..."
            />

            {/* Voice section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Voice</Label>
                <button
                  type="button"
                  onClick={() => setAddVoiceOpen(true)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-lg px-1.5 py-0.5 hover:bg-muted"
                >
                  <Plus size={12} />
                  Voice
                </button>
              </div>

              <Tabs value={voiceTab} onValueChange={setVoiceTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="voices" className="flex-1 text-xs">
                    Voices
                  </TabsTrigger>
                  <TabsTrigger value="clone" className="flex-1 text-xs">
                    Clone a voice
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="voices" className="mt-3">
                  <IconPillSelector
                    options={voices}
                    value={voice}
                    onChange={setVoice}
                    columns={3}
                  />
                </TabsContent>
                <TabsContent value="clone" className="mt-3">
                  <FileUploadZone
                    accept="audio"
                    label="Upload voice sample"
                    value={cloneFile}
                    onChange={setCloneFile}
                  />
                </TabsContent>
              </Tabs>
            </div>

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
            onItemClick={setSelectedItem}
          />
        }
      />

      {/* Add Voice Dialog */}
      <Dialog open={addVoiceOpen} onOpenChange={setAddVoiceOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base">Add custom voice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label className="text-xs">Voice name</Label>
              <Input
                value={newVoiceName}
                onChange={(e) => setNewVoiceName(e.target.value)}
                placeholder="e.g. My Voice"
                className="rounded-xl bg-input/50 border-border"
              />
            </div>
            <FileUploadZone
              accept="audio"
              label="Voice sample"
              value={newVoiceFile}
              onChange={setNewVoiceFile}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
              onClick={() => setAddVoiceOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="rounded-xl text-xs gradient-primary text-white border-0 hover:opacity-90"
              onClick={handleAddVoice}
              disabled={!newVoiceName.trim()}
            >
              Add voice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <GenerationPreviewModal
        variant="audio"
        item={selectedItem}
        color={feature.gradientFrom}
        open={!!selectedItem}
        onOpenChange={(open) => { if (!open) setSelectedItem(null); }}
      />
    </>
  );
}

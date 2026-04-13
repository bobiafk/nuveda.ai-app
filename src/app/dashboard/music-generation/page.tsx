"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const feature = getFeatureById("music-generation")!;

const genres = [
  { value: "electronic", label: "Electronic" },
  { value: "hip-hop", label: "Hip Hop" },
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "jazz", label: "Jazz" },
  { value: "classical", label: "Classical" },
  { value: "lo-fi", label: "Lo-Fi" },
  { value: "ambient", label: "Ambient" },
  { value: "cinematic", label: "Cinematic" },
];

const moods = [
  { value: "energetic", label: "Energetic" },
  { value: "relaxed", label: "Relaxed" },
  { value: "dark", label: "Dark" },
  { value: "uplifting", label: "Uplifting" },
  { value: "melancholic", label: "Melancholic" },
  { value: "epic", label: "Epic" },
  { value: "playful", label: "Playful" },
];

export default function MusicGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("electronic");
  const [mood, setMood] = useState("energetic");
  const [duration, setDuration] = useState([30]);
  const [bpm, setBpm] = useState([120]);
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
            placeholder="Describe the music you want to create..."
          />

          <div className="space-y-2">
            <Label className="text-xs font-medium">Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="rounded-xl bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {moods.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Duration</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{duration[0]}s</span>
            </div>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={10}
              max={300}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">BPM</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{bpm[0]}</span>
            </div>
            <Slider
              value={bpm}
              onValueChange={setBpm}
              min={60}
              max={200}
              step={5}
            />
          </div>
        </>
      }
      resultPanel={<ToolHistoryPanel feature={feature} />}
    />
  );
}

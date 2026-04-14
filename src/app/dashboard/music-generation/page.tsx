"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const feature = getFeatureById("music-generation")!;

const SAMPLE_TRACKS: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "Cosmic Drift — Ambient · Dreamy · 85 BPM" },
  { id: "s1", status: "completed", url: "#", prompt: "Midnight Drive — Synth-wave · Energetic · 128 BPM", duration: "2:34" },
  { id: "s2", status: "completed", url: "#", prompt: "Forest Rain — Lo-Fi · Relaxed · 75 BPM", duration: "3:02" },
  { id: "s3", status: "completed", url: "#", prompt: "Rise Up — Cinematic · Epic · 95 BPM", duration: "1:58" },
  { id: "s4", status: "completed", url: "#", prompt: "Golden Hour — Pop · Romantic · 110 BPM", duration: "2:45" },
  { id: "s5", status: "completed", url: "#", prompt: "Neon Nights — Electronic · Dark · 140 BPM", duration: "3:18" },
];

const genres = [
  "Pop", "Rock", "Hip Hop", "R&B", "Electronic",
  "Lo-Fi", "Jazz", "Classical", "Ambient", "Cinematic",
  "Indie", "Soul", "Funk", "Latin",
];

const moods = [
  "Energetic", "Relaxed", "Dark", "Uplifting",
  "Melancholic", "Epic", "Playful", "Romantic",
  "Dreamy", "Peaceful", "Nostalgic",
];

const VISIBLE_COUNT = 8;

function TagSelector({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? options : options.slice(0, VISIBLE_COUNT);
  const hasMore = options.length > VISIBLE_COUNT;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        {selected.length > 0 && (
          <span className="text-[10px] text-muted-foreground">
            {selected.length}/3
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {visible.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
              )}
            >
              {option}
            </button>
          );
        })}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground border border-dashed border-border hover:border-foreground/20 hover:text-foreground transition-colors flex items-center gap-1"
          >
            {expanded ? "Less" : `+${options.length - VISIBLE_COUNT} more`}
            <ChevronDown
              size={12}
              className={cn(
                "transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default function MusicGenerationPage() {
  const [mode, setMode] = useState<"create" | "custom">("create");
  const [prompt, setPrompt] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [title, setTitle] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Pop"]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["Energetic"]);
  const [duration, setDuration] = useState([120]);
  const [bpm, setBpm] = useState([120]);
  const [instrumental, setInstrumental] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_TRACKS);

  const toggleTag = (list: string[], value: string) => {
    if (list.includes(value)) return list.filter((v) => v !== value);
    if (list.length >= 3) return list;
    return [...list, value];
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt: prompt || [...selectedGenres, ...selectedMoods].join(", ") || "Music track",
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

  const formatDuration = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <ToolLayout
      feature={feature}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      configPanel={
        <>
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "create" | "custom")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="create" className="flex-1">
                Describe
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex-1">
                Custom
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Song Description</Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A chill lo-fi beat with soft piano, rain sounds, and a warm bass line perfect for late night studying..."
                  className="min-h-25 resize-none rounded-xl bg-input/50 border-border text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Song Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Song"
                  className="rounded-xl bg-input/50 border-border text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Lyrics</Label>
                  <span className="text-[10px] text-muted-foreground">
                    [Verse], [Chorus], [Bridge]
                  </span>
                </div>
                <Textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder={`[Verse]\nWalking down the empty street\nRain is falling at my feet\n\n[Chorus]\nBut I know that the sun will shine...`}
                  className="min-h-40 resize-none rounded-xl bg-input/50 border-border text-sm font-mono"
                />
              </div>
            </TabsContent>
          </Tabs>

          <TagSelector
            label="Genre"
            options={genres}
            selected={selectedGenres}
            onToggle={(v) => setSelectedGenres(toggleTag(selectedGenres, v))}
          />

          <TagSelector
            label="Mood"
            options={moods}
            selected={selectedMoods}
            onToggle={(v) => setSelectedMoods(toggleTag(selectedMoods, v))}
          />

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <Label className="text-xs font-medium">Instrumental</Label>
              <span className="text-[10px] text-muted-foreground">
                No vocals, music only
              </span>
            </div>
            <Switch
              checked={instrumental}
              onCheckedChange={setInstrumental}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Duration</Label>
              <span className="text-xs font-medium tabular-nums">
                {formatDuration(duration[0])}
              </span>
            </div>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={30}
              max={240}
              step={10}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0:30</span>
              <span>4:00</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Tempo</Label>
              <span className="text-xs font-medium tabular-nums">
                {bpm[0]} BPM
              </span>
            </div>
            <Slider
              value={bpm}
              onValueChange={setBpm}
              min={60}
              max={200}
              step={5}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </>
      }
      resultPanel={<ToolHistoryPanel feature={feature} generations={generations} onDelete={(id) => setGenerations((prev) => prev.filter((g) => g.id !== id))} onDismiss={(id) => setGenerations((prev) => prev.filter((g) => g.id !== id))} />}
    />
  );
}

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const feature = getFeatureById("music-generation")!;

const SAMPLE_TRACKS: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "Midnight Bloom — Pop · Female · 0.8" },
  { id: "s1", status: "completed", url: "#", prompt: "Midnight Drive — Synth-wave · Male · 0.7", duration: "2:34" },
  { id: "s2", status: "completed", url: "#", prompt: "Forest Rain — Lo-Fi · Female · 0.6", duration: "3:02" },
  { id: "s3", status: "completed", url: "#", prompt: "Rise Up — Cinematic · Male · 0.9", duration: "1:58" },
  { id: "s4", status: "completed", url: "#", prompt: "Golden Hour — Pop · Mixed · 0.75", duration: "2:45" },
];

const musicStyles = [
  "Pop", "Rock", "Hip Hop", "R&B", "Electronic",
  "Lo-Fi", "Jazz", "Classical", "Ambient", "Cinematic",
  "Indie", "Soul", "Funk", "Latin", "Country",
];

const VISIBLE_COUNT = 8;

function StyleSelector({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? musicStyles : musicStyles.slice(0, VISIBLE_COUNT);
  const hasMore = musicStyles.length > VISIBLE_COUNT;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">Music Style</Label>
        {selected.length > 0 && (
          <span className="text-[10px] text-muted-foreground">{selected.length}/3 selected</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visible.map((style) => {
          const isSelected = selected.includes(style);
          return (
            <button
              key={style}
              type="button"
              onClick={() => onToggle(style)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold leading-none transition-all duration-150 border select-none",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_-2px_var(--color-primary)] shadow-primary/35"
                  : "bg-white/4 text-muted-foreground border-white/10 hover:bg-white/8 hover:border-white/22 hover:text-foreground",
              )}
            >
              {style}
            </button>
          );
        })}
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground border border-dashed border-border hover:border-foreground/20 hover:text-foreground transition-colors flex items-center gap-1"
          >
            {expanded ? "Less" : `+${musicStyles.length - VISIBLE_COUNT} more`}
            <ChevronDown size={12} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
          </button>
        )}
      </div>
    </div>
  );
}

const genderOptions: PillOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "mixed", label: "Mixed" },
];

export default function MusicGenerationPage() {
  const [title, setTitle] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Pop"]);
  const [lyrics, setLyrics] = useState("");
  const [gender, setGender] = useState("female");
  const [audioWeight, setAudioWeight] = useState([0.75]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_TRACKS);

  const toggleStyle = (value: string) => {
    setSelectedStyles((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= 3) return prev;
      return [...prev, value];
    });
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const label = title || selectedStyles.join(", ") || "Music track";
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt: `${label} · ${gender.charAt(0).toUpperCase() + gender.slice(1)} · ${audioWeight[0]}`,
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

  return (
    <ToolLayout
      feature={feature}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      configPanel={
        <>
          {/* Song Title */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Song Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight Bloom"
              className="rounded-xl bg-input/50 border-border text-sm"
            />
          </div>

          {/* Music Style */}
          <StyleSelector selected={selectedStyles} onToggle={toggleStyle} />

          {/* Lyrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Lyrics</Label>
              <span className="text-[10px] text-muted-foreground">[Verse] [Chorus] [Bridge]</span>
            </div>
            <Textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder={`[Verse]\nWalking down the empty street\nRain is falling at my feet\n\n[Chorus]\nBut I know the sun will shine...`}
              className="min-h-40 resize-none rounded-xl bg-input/50 border-border text-sm font-mono"
            />
          </div>

          {/* Gender */}
          <IconPillSelector
            label="Gender"
            options={genderOptions}
            value={gender}
            onChange={setGender}
            columns={3}
          />

          {/* Audio Weight */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Audio Weight</Label>
              <span className="text-xs font-semibold tabular-nums text-foreground">
                {audioWeight[0].toFixed(2)}
              </span>
            </div>
            <Slider
              value={audioWeight}
              onValueChange={setAudioWeight}
              min={0}
              max={1}
              step={0.01}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0 — Subtle</span>
              <span>1 — Full</span>
            </div>
          </div>
        </>
      }
      resultPanel={
        <ToolHistoryPanel
          feature={feature}
          generations={generations}
          onDelete={(id) => setGenerations((prev) => prev.filter((g) => g.id !== id))}
          onDismiss={(id) => setGenerations((prev) => prev.filter((g) => g.id !== id))}
        />
      }
    />
  );
}

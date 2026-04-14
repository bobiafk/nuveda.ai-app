"use client";

import { useState } from "react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const feature = getFeatureById("caption-generator")!;

const SAMPLE_CAPTIONS: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "EN · Clean · SRT — Interview footage" },
  { id: "s1", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80", prompt: "EN · Clean · SRT", duration: "1:24" },
  { id: "s2", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80", prompt: "ES · Verbatim · VTT", duration: "2:15" },
  { id: "s3", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", prompt: "FR · Creative · SRT", duration: "0:58" },
  { id: "s4", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=800&q=80", prompt: "EN · Clean · JSON", duration: "3:02" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
];

const captionStyleOptions: PillOption[] = [
  { value: "verbatim", label: "Verbatim" },
  { value: "clean", label: "Clean" },
  { value: "creative", label: "Creative" },
];

const formatOptions: PillOption[] = [
  { value: "srt", label: "SRT" },
  { value: "vtt", label: "VTT" },
  { value: "txt", label: "TXT" },
  { value: "json", label: "JSON" },
];

export default function CaptionGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("en");
  const [style, setStyle] = useState("clean");
  const [format, setFormat] = useState("srt");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_CAPTIONS);

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt: `${language.toUpperCase()} · ${style} · ${format.toUpperCase()}`,
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
            accept="video"
            label="Upload Video"
            value={file}
            onChange={setFile}
          />

          {/* Language — many options, keep as Select */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="rounded-xl bg-input/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Caption style — 3 options, pill grid */}
          <IconPillSelector
            label="Caption Style"
            options={captionStyleOptions}
            value={style}
            onChange={setStyle}
            columns={3}
          />

          {/* Output format — 4 options, pill grid */}
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

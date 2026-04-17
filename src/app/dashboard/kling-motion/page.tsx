"use client";

import { useRef, useState } from "react";
import { Film, ImageIcon, Volume2, ChevronDown, FolderOpen, Upload } from "lucide-react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const feature = getFeatureById("kling-motion")!;

const SAMPLE_VIDEOS: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "Kling 3.0 Standard — Person walking scene" },
  { id: "s1", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", prompt: "Kling 3.0 Standard · 720p", duration: "0:05" },
  { id: "s2", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80", prompt: "Kling 3.0 Pro · 1080p", duration: "0:08" },
  { id: "s3", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80", prompt: "Kling 2.1 · 720p", duration: "0:06" },
];

interface KlingModel {
  value: string;
  label: string;
  subtitle: string;
  resolution: string;
}

const KLING_MODELS: KlingModel[] = [
  {
    value: "kling-3-standard",
    label: "Kling 3.0 Standard Motion Control",
    subtitle: "Standard motion control · 720p · 25–130 credits",
    resolution: "720p",
  },
  {
    value: "kling-3-pro",
    label: "Kling 3.0 Pro Motion Control",
    subtitle: "Pro motion control · 1080p · 40–200 credits",
    resolution: "1080p",
  },
  {
    value: "kling-2-standard",
    label: "Kling 2.1 Motion Control",
    subtitle: "Legacy motion control · 720p · 15–80 credits",
    resolution: "720p",
  },
];

// ─── Upload Card ────────────────────────────────────────────────────────────
interface UploadCardProps {
  title: string;
  subtitle: string;
  formats: string;
  accept: string;
  icon: React.ReactNode;
  value: File | null;
  onChange: (file: File | null) => void;
}

function UploadCard({ title, subtitle, formats, accept, icon, value, onChange }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-2.5 rounded-2xl border bg-card/50 p-5 text-center transition-colors min-h-44",
        isDragging ? "border-primary bg-primary/5" : "border-border",
        value && "border-primary/40 bg-primary/3",
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onChange(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />

      {value ? (
        <>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Upload size={18} />
          </div>
          <div className="w-full min-w-0">
            <p className="text-xs font-semibold truncate">{value.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {(value.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Remove
          </button>
        </>
      ) : (
        <>
          <div className="text-muted-foreground/60">{icon}</div>
          <div>
            <p className="text-[13px] font-semibold text-foreground">{title}</p>
            <p className="text-[11px] text-amber-400/80 mt-0.5">{subtitle}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">{formats} — drag & drop or click</p>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-full border border-border/80 bg-transparent px-3.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              Browse
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-border/80 bg-transparent px-3.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <FolderOpen size={11} />
              Library
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Model Selector ──────────────────────────────────────────────────────────
interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = KLING_MODELS.find((m) => m.value === value) ?? KLING_MODELS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 rounded-xl border border-border bg-input/50 px-4 py-3 text-left transition-colors hover:bg-input/70"
      >
        <div>
          <p className="text-[13px] font-semibold text-foreground">{selected.label}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{selected.subtitle}</p>
        </div>
        <ChevronDown
          size={15}
          className={cn("shrink-0 text-muted-foreground transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1.5 rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
          {KLING_MODELS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => { onChange(m.value); setOpen(false); }}
              className={cn(
                "w-full px-4 py-3 text-left transition-colors hover:bg-muted/60",
                m.value === value && "bg-primary/8",
              )}
            >
              <p className="text-[13px] font-semibold text-foreground">{m.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{m.subtitle}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Character Orientation Selector ─────────────────────────────────────────
interface OrientationSelectorProps {
  value: "video" | "image";
  onChange: (v: "video" | "image") => void;
}

function OrientationSelector({ value, onChange }: OrientationSelectorProps) {
  const options = [
    {
      id: "video" as const,
      icon: <Film size={18} strokeWidth={1.5} />,
      label: "Video",
      description: "Extract character from the motion video",
    },
    {
      id: "image" as const,
      icon: <ImageIcon size={18} strokeWidth={1.5} />,
      label: "Image",
      description: "Use the uploaded character image",
    },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Character Orientation</Label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition-all duration-150",
                isSelected
                  ? "border-foreground bg-white/4"
                  : "border-border/60 bg-white/2 hover:border-border hover:bg-white/4",
              )}
            >
              <div className={cn("transition-colors", isSelected ? "text-foreground" : "text-muted-foreground")}>
                {opt.icon}
              </div>
              <p className={cn("text-[13px] font-semibold leading-none", isSelected ? "text-foreground" : "text-muted-foreground")}>
                {opt.label}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug">{opt.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function KlingMotionPage() {
  const [motionVideo, setMotionVideo] = useState<File | null>(null);
  const [characterImage, setCharacterImage] = useState<File | null>(null);
  const [model, setModel] = useState("kling-3-standard");
  const [orientation, setOrientation] = useState<"video" | "image">("image");
  const [prompt, setPrompt] = useState("");
  const [keepSound, setKeepSound] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_VIDEOS);

  const selectedModel = KLING_MODELS.find((m) => m.value === model) ?? KLING_MODELS[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt: `${selectedModel.label} · ${selectedModel.resolution}`,
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

  const handleDelete = (id: string) => setGenerations((prev) => prev.filter((g) => g.id !== id));
  const handleDismiss = (id: string) => setGenerations((prev) => prev.filter((g) => g.id !== id));

  return (
    <ToolLayout
      feature={feature}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      configPanel={
        <>
          {/* Two upload cards */}
          <div className="grid grid-cols-2 gap-2">
            <UploadCard
              title="Upload motion video"
              subtitle="Video with the motion to transfer"
              formats="MP4, WebM, MOV"
              accept="video/mp4,video/webm,video/quicktime"
              icon={
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="8" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M24 14l7-4v16l-7-4V14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
              value={motionVideo}
              onChange={setMotionVideo}
            />
            <UploadCard
              title="Upload character image"
              subtitle="The character to apply motion to"
              formats="PNG, JPG, WebP"
              accept="image/png,image/jpeg,image/webp"
              icon={
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="6" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="13" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 24l8-6 6 5 4-3 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              }
              value={characterImage}
              onChange={setCharacterImage}
            />
          </div>

          {/* Model selector */}
          <ModelSelector value={model} onChange={setModel} />

          {/* Character orientation */}
          <OrientationSelector value={orientation} onChange={setOrientation} />

          {/* Prompt */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Prompt</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the motion or scene..."
              className="min-h-24 resize-none rounded-xl bg-input/50 border-border text-sm"
            />
          </div>

          {/* Keep Original Sound */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-muted-foreground" />
              <Label className="text-xs font-medium cursor-pointer">Keep Original Sound</Label>
            </div>
            <Switch checked={keepSound} onCheckedChange={setKeepSound} />
          </div>

          {/* Resolution (read-only, driven by model) */}
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Resolution</Label>
            <span className="rounded-lg bg-muted/60 border border-border/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {selectedModel.resolution}
            </span>
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

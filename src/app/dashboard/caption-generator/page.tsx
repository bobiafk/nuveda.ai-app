"use client";

import { useState } from "react";
import { Copy, Check, Trash2, Hash, Smile, MessageCircle } from "lucide-react";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Zap, Clock } from "lucide-react";

const feature = getFeatureById("caption-generator")!;

interface CaptionItem {
  id: string;
  status: "completed" | "processing" | "failed";
  caption?: string;
  thumbnailUrl?: string;
  tone: string;
  length: string;
}

const SAMPLE_CAPTION_MAP: Record<string, Record<string, string>> = {
  casual: {
    short: "Just living my best life ✨ Some days are made for sunshine and good vibes! 🌟",
    medium:
      "Just living my best life ✨ Some days are made for sunshine and good vibes. Here's to the little moments that make everything worth it!\n\n#GoodVibes #LivingMyBestLife #Blessed",
    long: "Just living my best life ✨ Some days are made for sunshine, laughter, and the people who make your heart full. There's something so special about slowing down and appreciating the little things.\n\nHere's to more of these moments. Tag someone you'd share this with! 💛\n\n#GoodVibes #LivingMyBestLife #Blessed #WeekendFeels #Grateful",
  },
  funny: {
    short: "POV: You when the photographer says 'act natural' 😂 Absolutely nailed it.",
    medium:
      "POV: You when the photographer says 'act natural' 😂 Pretty sure I nailed it. Tag someone who looks exactly like this in every photo! 👇\n\n#Relatable #PhotoFail #SendHelp",
    long: "POV: You when the photographer says 'act natural' 😂 I practiced this look in the mirror for approximately 0 seconds, and it shows. The confidence of someone who has no idea what they're doing — that's me. Every. Single. Time.\n\nTag your most photogenic friend who makes the rest of us look bad 👇😩\n\n#Relatable #NaturallyAwkward #PhotoFail #SendHelp #WhoApprovedThis",
  },
  inspirational: {
    short: "Every great story begins with a single step. Keep going. ✨",
    medium:
      "Every great story begins with a single step. This moment is a reminder that the journey is just as beautiful as the destination. Keep going — you're closer than you think. ✨\n\n#Motivated #DreamBig #Inspired",
    long: "Every great story begins with a single step. This moment is a reminder that the journey is just as beautiful as the destination. We often get so focused on where we're going that we forget to appreciate how far we've already come.\n\nYou are capable of more than you know. Keep going — the best is still ahead. ✨\n\n#Motivated #DreamBig #Inspired #NeverGiveUp #KeepGoing #MindsetMatters",
  },
  professional: {
    short: "Honored to share this milestone. Excited for what's ahead. #Growth #Leadership",
    medium:
      "Honored to share this milestone with an incredible team. Our commitment to excellence and collaboration continues to drive meaningful results. Excited for what's ahead.\n\n#Leadership #Growth #Professional",
    long: "Honored to share this milestone with a truly remarkable team. Our work together has been defined by a shared commitment to excellence, innovation, and genuine collaboration. Every step forward is a reflection of the dedication each person brings to the table.\n\nThank you to everyone who has been part of this journey. Here's to what we build next.\n\n#Leadership #Growth #Professional #Teamwork #Innovation #Excellence",
  },
  romantic: {
    short: "With you, every ordinary day turns into something extraordinary. 💕",
    medium:
      "Some moments are too perfect not to capture. With you, every ordinary day turns into something extraordinary. Grateful for every second. 💕\n\n#Love #Together #Blessed",
    long: "Some moments are too perfect not to capture. With you, the world feels softer, brighter, and full of possibility. Every ordinary Tuesday becomes a memory I want to hold onto forever.\n\nThank you for making every moment feel like it matters. I love you more than words. 💕\n\n#Love #Together #Blessed #ForeverAndAlways #MyPerson #LoveStory",
  },
};

function getSampleCaption(
  tone: string,
  length: string,
  includeHashtags: boolean,
  includeEmojis: boolean,
): string {
  const base = SAMPLE_CAPTION_MAP[tone]?.[length] ?? SAMPLE_CAPTION_MAP.casual.medium;
  let result = base;
  if (!includeHashtags) {
    result = result.replace(/\n\n#[^\n]*/g, "").replace(/ #\w+/g, "");
  }
  if (!includeEmojis) {
    result = result.replace(/[\u{1F300}-\u{1FFFF}]|[\u2600-\u27BF]/gu, "").trim();
  }
  return result;
}

const toneOptions: PillOption[] = [
  { value: "casual", label: "Casual" },
  { value: "funny", label: "Funny" },
  { value: "inspirational", label: "Inspirational" },
  { value: "professional", label: "Professional" },
  { value: "romantic", label: "Romantic" },
];

const lengthOptions: PillOption[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

const TONE_COLORS: Record<string, string> = {
  casual: "#0EA5E9",
  funny: "#F59E0B",
  inspirational: "#8B5CF6",
  professional: "#10B981",
  romantic: "#EC4899",
};

const SAMPLE_ITEMS: CaptionItem[] = [
  {
    id: "loading",
    status: "processing",
    tone: "inspirational",
    length: "medium",
  },
  {
    id: "s1",
    status: "completed",
    thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    tone: "casual",
    length: "medium",
    caption: SAMPLE_CAPTION_MAP.casual.medium,
  },
  {
    id: "s2",
    status: "completed",
    thumbnailUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=120&q=80",
    tone: "romantic",
    length: "short",
    caption: SAMPLE_CAPTION_MAP.romantic.short,
  },
  {
    id: "s3",
    status: "completed",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&q=80",
    tone: "inspirational",
    length: "long",
    caption: SAMPLE_CAPTION_MAP.inspirational.long,
  },
];

function CaptionCard({
  item,
  onDelete,
}: {
  item: CaptionItem;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (item.caption) {
      navigator.clipboard.writeText(item.caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toneColor = TONE_COLORS[item.tone] ?? "#0EA5E9";

  if (item.status === "processing") {
    return (
      <div className="sm:col-span-2 rounded-2xl border border-border bg-card/60 overflow-hidden animate-pulse">
        <div className="flex items-center gap-3 p-4 border-b border-border/60">
          <div className="h-9 w-9 rounded-lg bg-muted shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-28 rounded bg-muted" />
            <div className="h-2.5 w-16 rounded bg-muted" />
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-5/6 rounded bg-muted" />
          <div className="h-3 w-4/6 rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 overflow-hidden flex flex-col group">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border/50">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt=""
            className="h-9 w-9 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div
            className="h-9 w-9 rounded-lg shrink-0 flex items-center justify-center"
            style={{ backgroundColor: `color-mix(in oklch, ${toneColor} 12%, transparent)` }}
          >
            <MessageCircle size={15} style={{ color: toneColor }} />
          </div>
        )}

        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <span
            className="text-[10px] font-semibold capitalize px-1.5 py-0.5 rounded-full shrink-0"
            style={{
              color: toneColor,
              backgroundColor: `color-mix(in oklch, ${toneColor} 12%, transparent)`,
            }}
          >
            {item.tone}
          </span>
          <span className="text-[10px] text-muted-foreground capitalize truncate">{item.length}</span>
        </div>

        {/* Minimal action buttons — always visible */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={handleCopy}
            className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
            title="Copy"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Caption text */}
      <div className="px-3.5 py-3 flex-1">
        <p className="text-[13px] text-foreground/85 leading-relaxed whitespace-pre-line line-clamp-8">
          {item.caption}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-105 px-6">
      <div className="relative mb-8">
        <div
          className="absolute -inset-10 rounded-full opacity-[0.05]"
          style={{
            background: `radial-gradient(circle, ${feature.gradientFrom}, transparent 70%)`,
          }}
        />
        <div
          className="relative h-14 w-14 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: `color-mix(in oklch, ${feature.gradientFrom} 10%, transparent)`,
          }}
        >
          <feature.icon
            size={26}
            strokeWidth={1.5}
            style={{ color: feature.gradientFrom }}
          />
        </div>
      </div>

      <h3 className="text-base font-semibold mb-1.5">No captions yet</h3>
      <p className="text-sm text-muted-foreground text-center max-w-65 mb-8 leading-relaxed">
        Upload a photo, choose a tone, and hit Generate to craft your perfect Facebook caption.
      </p>

      <div className="flex items-center gap-6 pt-5 border-t border-border/60 w-full max-w-65">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Zap size={12} className="text-primary shrink-0" />
          <span>
            <strong className="text-foreground">{feature.creditCost}</strong> credits
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={12} className="shrink-0" />
          <span>~5–10s</span>
        </div>
      </div>
    </div>
  );
}

export default function CaptionGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [tone, setTone] = useState("casual");
  const [length, setLength] = useState("medium");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<CaptionItem[]>(SAMPLE_ITEMS);

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: CaptionItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      tone,
      length,
    };
    setCaptions((prev) => [newItem, ...prev]);

    setTimeout(() => {
      setIsGenerating(false);
      const generated = getSampleCaption(tone, length, includeHashtags, includeEmojis);
      setCaptions((prev) =>
        prev.map((c) =>
          c.id === newItem.id
            ? {
                ...c,
                status: "completed" as const,
                caption: generated,
                thumbnailUrl: file ? URL.createObjectURL(file) : undefined,
              }
            : c,
        ),
      );
    }, 3000);
  };

  const handleDelete = (id: string) => setCaptions((prev) => prev.filter((c) => c.id !== id));

  return (
    <ToolLayout
      feature={feature}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      configPanel={
        <>
          <FileUploadZone
            accept="image"
            label="Upload Photo"
            value={file}
            onChange={setFile}
          />

          <IconPillSelector
            label="Tone"
            options={toneOptions}
            value={tone}
            onChange={setTone}
            columns={3}
          />

          <IconPillSelector
            label="Caption Length"
            options={lengthOptions}
            value={length}
            onChange={setLength}
            columns={3}
          />

          {/* Hashtags toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash size={14} className="text-muted-foreground" />
              <Label className="text-xs font-medium cursor-pointer">Include Hashtags</Label>
            </div>
            <Switch checked={includeHashtags} onCheckedChange={setIncludeHashtags} />
          </div>

          {/* Emojis toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile size={14} className="text-muted-foreground" />
              <Label className="text-xs font-medium cursor-pointer">Include Emojis</Label>
            </div>
            <Switch checked={includeEmojis} onCheckedChange={setIncludeEmojis} />
          </div>
        </>
      }
      resultPanel={
        captions.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Generated Captions</h3>
              <span className="text-xs text-muted-foreground">
                {captions.length} {captions.length === 1 ? "caption" : "captions"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {captions.map((item) => (
                <CaptionCard key={item.id} item={item} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )
      }
    />
  );
}

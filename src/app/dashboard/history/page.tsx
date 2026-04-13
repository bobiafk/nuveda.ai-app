"use client";

import { useState } from "react";
import { Search, Filter, Clock, Download, ExternalLink, Image, Music, Mic, Film, AudioLines, Captions, Move3D, Sparkles, ArrowUpCircle, UserCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  feature: string;
  featureLabel: string;
  title: string;
  status: "completed" | "processing" | "failed";
  timestamp: string;
  creditCost: number;
  color: string;
  icon: React.ElementType;
}

const historyItems: HistoryItem[] = [
  { id: "1", feature: "image-generation", featureLabel: "Image", title: "Sunset landscape with mountains and river", status: "completed", timestamp: "2 minutes ago", creditCost: 5, color: "#8B5CF6", icon: Image },
  { id: "2", feature: "music-generation", featureLabel: "Music", title: "Lo-fi chill beat, 90 BPM, ambient mood", status: "completed", timestamp: "15 minutes ago", creditCost: 8, color: "#EC4899", icon: Music },
  { id: "3", feature: "audio-generation", featureLabel: "Audio", title: "Product demo narration — warm tone", status: "processing", timestamp: "20 minutes ago", creditCost: 3, color: "#10B981", icon: Mic },
  { id: "4", feature: "ai-avatar-video", featureLabel: "Avatar", title: "CEO keynote presentation avatar", status: "completed", timestamp: "1 hour ago", creditCost: 15, color: "#D946EF", icon: UserCircle },
  { id: "5", feature: "image-upscaling", featureLabel: "Upscale", title: "Product photo 4x upscale", status: "completed", timestamp: "2 hours ago", creditCost: 2, color: "#F59E0B", icon: ArrowUpCircle },
  { id: "6", feature: "caption-generator", featureLabel: "Caption", title: "Tutorial video captions — English", status: "completed", timestamp: "3 hours ago", creditCost: 3, color: "#0EA5E9", icon: Captions },
  { id: "7", feature: "voice-generation", featureLabel: "Voice", title: "Audiobook chapter 3 — Aria voice", status: "completed", timestamp: "4 hours ago", creditCost: 4, color: "#6366F1", icon: AudioLines },
  { id: "8", feature: "kling-motion", featureLabel: "Motion", title: "Product showcase zoom animation", status: "failed", timestamp: "5 hours ago", creditCost: 0, color: "#84CC16", icon: Move3D },
  { id: "9", feature: "prompt-optimizer", featureLabel: "Prompt", title: "Optimized: fantasy castle concept", status: "completed", timestamp: "6 hours ago", creditCost: 1, color: "#EAB308", icon: Sparkles },
  { id: "10", feature: "video-upscaling", featureLabel: "Video", title: "Interview footage 4K upscale", status: "completed", timestamp: "1 day ago", creditCost: 10, color: "#06B6D4", icon: Film },
  { id: "11", feature: "image-generation", featureLabel: "Image", title: "Abstract gradient art for social media", status: "completed", timestamp: "1 day ago", creditCost: 5, color: "#8B5CF6", icon: Image },
  { id: "12", feature: "music-generation", featureLabel: "Music", title: "Epic cinematic trailer music", status: "completed", timestamp: "2 days ago", creditCost: 8, color: "#EC4899", icon: Music },
];

const filterTabs = [
  { value: "all", label: "All" },
  { value: "image-generation", label: "Image" },
  { value: "audio-generation", label: "Audio" },
  { value: "music-generation", label: "Music" },
  { value: "video", label: "Video" },
  { value: "voice-generation", label: "Voice" },
  { value: "other", label: "Other" },
];

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = historyItems.filter((item) => {
    if (activeFilter !== "all" && !item.feature.includes(activeFilter.replace("video", "upscal"))) {
      if (activeFilter === "video") {
        if (!item.feature.includes("video") && !item.feature.includes("avatar")) return false;
      } else if (activeFilter === "other") {
        if (!["caption-generator", "kling-motion", "prompt-optimizer"].includes(item.feature)) return false;
      } else {
        if (item.feature !== activeFilter) return false;
      }
    }
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Generation History" subtitle="View all your past generations across tools" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search generations..."
            className="pl-9 h-9 rounded-xl bg-white/5 border-white/10 text-sm"
          />
        </div>
        <Tabs value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="h-8">
            {filterTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-2.5 h-6">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl glass border border-white/10 p-4 hover:border-white/15 transition-colors group"
          >
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)` }}
            >
              <item.icon size={18} style={{ color: item.color }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <Badge
                  variant={item.status === "completed" ? "secondary" : item.status === "processing" ? "default" : "destructive"}
                  className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                >
                  {item.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{item.featureLabel}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {item.timestamp}
                </span>
                {item.creditCost > 0 && (
                  <>
                    <span>·</span>
                    <span>{item.creditCost} credits</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" className="rounded-xl text-xs" disabled>
          Previous
        </Button>
        <span className="text-xs text-muted-foreground px-3">Page 1 of 3</span>
        <Button variant="outline" size="sm" className="rounded-xl text-xs">
          Next
        </Button>
      </div>
    </div>
  );
}

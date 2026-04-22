"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageGalleryCard } from "@/components/tools/image-gallery-card";
import { VideoGalleryCard } from "@/components/tools/video-gallery-card";
import { AudioGalleryCard } from "@/components/tools/audio-gallery-card";
import { GenerationPreviewModal } from "@/components/tools/generation-preview-modal";
import type { GenerationItem } from "@/components/tools/tool-history-panel";

const IMAGE_HISTORY: GenerationItem[] = [
  { id: "i1", status: "completed", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80", prompt: "Abstract neon cityscape, digital art" },
  { id: "i2", status: "completed", url: "https://images.unsplash.com/photo-1696446702183-cbd30e087e03?w=600&q=80", prompt: "Cinematic portrait, golden hour" },
  { id: "i3", status: "completed", url: "https://images.unsplash.com/photo-1635776063360-af6b1e8aead4?w=600&q=80", prompt: "Sci-fi landscape, ultra-detailed" },
  { id: "i4", status: "completed", url: "https://images.unsplash.com/photo-1686191129054-c88d3fca3b3a?w=600&q=80", prompt: "Fantasy forest, mystical lighting" },
  { id: "i5", status: "completed", url: "https://images.unsplash.com/photo-1636955779321-819753cd1741?w=600&q=80", prompt: "Futuristic architecture, 8K" },
  { id: "i6", status: "completed", url: "https://images.unsplash.com/photo-1701985494888-c3a7b4b72752?w=600&q=80", prompt: "Dreamy ocean at sunset, photorealistic" },
  { id: "i7", status: "completed", url: "https://images.unsplash.com/photo-1620503374956-c942862f0372?w=600&q=80", prompt: "Sunset landscape with mountains and river" },
  { id: "i8", status: "completed", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", prompt: "Abstract gradient art for social media" },
];

const VIDEO_HISTORY: GenerationItem[] = [
  { id: "v1", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80", prompt: "CEO keynote presentation avatar", duration: "0:15" },
  { id: "v2", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80", prompt: "Product showcase zoom animation", duration: "0:10" },
  { id: "v3", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1536240478700-b869ad10a2a2?w=600&q=80", prompt: "Interview footage 4K upscale", duration: "2:30" },
  { id: "v4", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1608346128025-1896b97a6bfa?w=600&q=80", prompt: "Fantasy landscape camera pan", duration: "0:08" },
];

const AUDIO_HISTORY: GenerationItem[] = [
  { id: "a1", status: "completed", url: "#", prompt: "Product demo narration — warm tone", duration: "0:42" },
  { id: "a2", status: "completed", url: "#", prompt: "Upbeat electronic background music", duration: "1:24" },
  { id: "a3", status: "completed", url: "#", prompt: "Calm ambient meditation soundtrack", duration: "2:05" },
  { id: "a4", status: "completed", url: "#", prompt: "Epic orchestral cinematic theme", duration: "1:45" },
  { id: "a5", status: "completed", url: "#", prompt: "Audiobook chapter 3 — Aria voice", duration: "3:12" },
  { id: "a6", status: "completed", url: "#", prompt: "Jazz piano lounge session", duration: "3:22" },
];

type PreviewVariant = "image" | "video" | "audio";

export default function GenerationsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("image");
  const [selectedItem, setSelectedItem] = useState<GenerationItem | null>(null);
  const [previewVariant, setPreviewVariant] = useState<PreviewVariant>("image");

  const [images, setImages] = useState<GenerationItem[]>(IMAGE_HISTORY);
  const [videos, setVideos] = useState<GenerationItem[]>(VIDEO_HISTORY);
  const [audios, setAudios] = useState<GenerationItem[]>(AUDIO_HISTORY);

  const filteredImages = images.filter((i) =>
    !search || i.prompt?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredVideos = videos.filter((i) =>
    !search || i.prompt?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredAudios = audios.filter((i) =>
    !search || i.prompt?.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageClick = (item: GenerationItem) => {
    setPreviewVariant("image");
    setSelectedItem(item);
  };
  const handleVideoClick = (item: GenerationItem) => {
    setPreviewVariant("video");
    setSelectedItem(item);
  };
  const handleAudioClick = (item: GenerationItem) => {
    setPreviewVariant("audio");
    setSelectedItem(item);
  };

  const previewColor =
    previewVariant === "image"
      ? "#8B5CF6"
      : previewVariant === "video"
        ? "#D946EF"
        : "#10B981";

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
        <PageHeader title="Generations" subtitle="Your generated images, videos, and audio" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search generations..."
              className="pl-9 h-9 rounded-xl bg-input/50 border-border text-sm"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-9 mb-5">
            <TabsTrigger value="image" className="text-xs px-4">
              Images
              <span className="ml-1.5 text-[10px] text-muted-foreground tabular-nums">
                {filteredImages.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="video" className="text-xs px-4">
              Videos
              <span className="ml-1.5 text-[10px] text-muted-foreground tabular-nums">
                {filteredVideos.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="text-xs px-4">
              Audio
              <span className="ml-1.5 text-[10px] text-muted-foreground tabular-nums">
                {filteredAudios.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image">
            {filteredImages.length === 0 ? (
              <EmptyTabMessage />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredImages.map((item) => (
                  <ImageGalleryCard
                    key={item.id}
                    {...item}
                    color="#8B5CF6"
                    onDelete={(id) => setImages((prev) => prev.filter((i) => i.id !== id))}
                    onClick={() => handleImageClick(item)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="video">
            {filteredVideos.length === 0 ? (
              <EmptyTabMessage />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredVideos.map((item) => (
                  <VideoGalleryCard
                    key={item.id}
                    {...item}
                    color="#D946EF"
                    onDelete={(id) => setVideos((prev) => prev.filter((i) => i.id !== id))}
                    onClick={() => handleVideoClick(item)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="audio">
            {filteredAudios.length === 0 ? (
              <EmptyTabMessage />
            ) : (
              <div className="flex flex-col gap-2">
                {filteredAudios.map((item) => (
                  <AudioGalleryCard
                    key={item.id}
                    {...item}
                    color="#10B981"
                    onDelete={(id) => setAudios((prev) => prev.filter((i) => i.id !== id))}
                    onClick={() => handleAudioClick(item)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <GenerationPreviewModal
        variant={previewVariant}
        item={selectedItem}
        color={previewColor}
        open={!!selectedItem}
        onOpenChange={(open) => { if (!open) setSelectedItem(null); }}
      />
    </div>
  );
}

function EmptyTabMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-sm">
      No generations found
    </div>
  );
}

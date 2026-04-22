"use client";

import { useState } from "react";
import Image from "next/image";
import { getFeatureById } from "@/lib/features";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ToolHistoryPanel, type GenerationItem } from "@/components/tools/tool-history-panel";
import { PromptInput } from "@/components/tools/prompt-input";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { IconPillSelector, type PillOption } from "@/components/tools/icon-pill-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Images, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const feature = getFeatureById("ai-avatar-video")!;

interface AvatarLibraryItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

const AVATAR_LIBRARY: AvatarLibraryItem[] = [
  { id: "av1", name: "Sarah", category: "Professional", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80" },
  { id: "av2", name: "James", category: "Professional", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { id: "av3", name: "Emma", category: "Casual", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80" },
  { id: "av4", name: "Olivia", category: "Casual", imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&q=80" },
  { id: "av5", name: "Marcus", category: "Professional", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" },
  { id: "av6", name: "Aisha", category: "Casual", imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80" },
  { id: "av7", name: "David", category: "Professional", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
  { id: "av8", name: "Priya", category: "Casual", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80" },
  { id: "av9", name: "Chen", category: "Professional", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80" },
];

const SAMPLE_AVATARS: GenerationItem[] = [
  { id: "loading", status: "processing", prompt: "New product demo walkthrough script" },
  { id: "s1", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80", prompt: "Product launch announcement script", duration: "0:32" },
  { id: "s2", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", prompt: "Welcome onboarding video", duration: "0:45" },
  { id: "s3", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80", prompt: "Weekly team update presentation", duration: "1:02" },
  { id: "s4", status: "completed", thumbnailUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80", prompt: "Social media promotional clip", duration: "0:28" },
];

const expressionOptions: PillOption[] = [
  { value: "neutral", label: "Neutral" },
  { value: "happy", label: "Happy" },
  { value: "professional", label: "Professional" },
  { value: "excited", label: "Excited" },
  { value: "serious", label: "Serious" },
  { value: "friendly", label: "Friendly" },
];

const backgroundOptions: PillOption[] = [
  { value: "office", label: "Office" },
  { value: "studio", label: "Studio" },
  { value: "nature", label: "Nature" },
  { value: "abstract", label: "Abstract" },
  { value: "transparent", label: "Transparent" },
  { value: "custom", label: "Custom" },
];

export default function AiAvatarVideoPage() {
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [selectedLibraryAvatar, setSelectedLibraryAvatar] = useState<AvatarLibraryItem | null>(null);
  const [avatarLibraryOpen, setAvatarLibraryOpen] = useState(false);
  const [libraryPickerSelected, setLibraryPickerSelected] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState("script");
  const [script, setScript] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [expression, setExpression] = useState("neutral");
  const [background, setBackground] = useState("studio");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationItem[]>(SAMPLE_AVATARS);

  const handleGenerate = () => {
    setIsGenerating(true);
    const newItem: GenerationItem = {
      id: `gen-${Date.now()}`,
      status: "processing",
      prompt: script || "Avatar video",
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
          {/* Avatar Image Upload + Browse Library */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Avatar Image</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1.5 px-2 text-xs text-primary hover:text-primary"
                onClick={() => {
                  setLibraryPickerSelected(selectedLibraryAvatar?.id ?? null);
                  setAvatarLibraryOpen(true);
                }}
              >
                <Images size={13} />
                Browse Library
              </Button>
            </div>

            {selectedLibraryAvatar && !avatarImage ? (
              <div className="flex items-center gap-3 rounded-xl bg-input/50 border border-border p-3">
                <Image
                  src={selectedLibraryAvatar.imageUrl}
                  alt={selectedLibraryAvatar.name}
                  width={36}
                  height={36}
                  className="rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedLibraryAvatar.name}</p>
                  <p className="text-[11px] text-muted-foreground">{selectedLibraryAvatar.category}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs shrink-0"
                  onClick={() => setSelectedLibraryAvatar(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <FileUploadZone
                accept="image"
                value={avatarImage}
                onChange={(f) => {
                  setAvatarImage(f);
                  if (f) setSelectedLibraryAvatar(null);
                }}
              />
            )}
          </div>

          {/* Avatar Library Dialog */}
          <Dialog open={avatarLibraryOpen} onOpenChange={setAvatarLibraryOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Avatar Library</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 max-h-100 overflow-y-auto pr-1">
                {AVATAR_LIBRARY.map((avatar) => {
                  const isSelected = libraryPickerSelected === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => setLibraryPickerSelected(avatar.id)}
                      className={cn(
                        "group relative rounded-xl overflow-hidden border-2 transition-all text-left focus:outline-none",
                        isSelected ? "border-primary" : "border-transparent hover:border-border"
                      )}
                    >
                      <Image
                        src={avatar.imageUrl}
                        alt={avatar.name}
                        width={200}
                        height={200}
                        className="w-full aspect-square object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground rounded-full p-1">
                            <Check size={14} />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium">{avatar.name}</p>
                        <p className="text-white/70 text-[10px]">{avatar.category}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => setAvatarLibraryOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!libraryPickerSelected}
                  onClick={() => {
                    const avatar = AVATAR_LIBRARY.find((a) => a.id === libraryPickerSelected);
                    if (avatar) {
                      setSelectedLibraryAvatar(avatar);
                      setAvatarImage(null);
                    }
                    setAvatarLibraryOpen(false);
                  }}
                >
                  Use Avatar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-2">
            <Tabs value={inputMode} onValueChange={setInputMode}>
              <TabsList className="w-full">
                <TabsTrigger value="script" className="flex-1 text-xs">
                  Script
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex-1 text-xs">
                  Audio Upload
                </TabsTrigger>
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

          {/* Expression */}
          <IconPillSelector
            label="Expression"
            options={expressionOptions}
            value={expression}
            onChange={setExpression}
            columns={3}
          />

          {/* Background */}
          <IconPillSelector
            label="Background"
            options={backgroundOptions}
            value={background}
            onChange={setBackground}
            columns={3}
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

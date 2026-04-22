"use client";

import { useRef } from "react";
import { ImageIcon, Video, Music, X, Plus } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type RefKind = "image" | "video" | "audio";

export interface RefItem {
  id: string;
  kind: RefKind;
  file: File;
  previewUrl: string;
}

interface MultiReferenceUploaderProps {
  label?: string;
  items: RefItem[];
  activeKind: RefKind;
  onActiveKindChange: (kind: RefKind) => void;
  onAdd: (kind: RefKind, files: File[]) => void;
  onRemove: (id: string) => void;
  limits?: Partial<Record<RefKind, number>>;
}

const DEFAULT_LIMITS: Record<RefKind, number> = {
  image: 9,
  video: 3,
  audio: 3,
};

const KIND_META: Record<RefKind, { icon: React.ElementType; label: string; accept: string }> = {
  image: { icon: ImageIcon, label: "Image", accept: "image/*" },
  video: { icon: Video, label: "Video", accept: "video/*" },
  audio: { icon: Music, label: "Audio", accept: "audio/*" },
};

const KINDS: RefKind[] = ["image", "video", "audio"];

export function MultiReferenceUploader({
  label = "References",
  items,
  activeKind,
  onActiveKindChange,
  onAdd,
  onRemove,
  limits = {},
}: MultiReferenceUploaderProps) {
  const inputRefs = useRef<Partial<Record<RefKind, HTMLInputElement | null>>>({});
  const resolvedLimits = { ...DEFAULT_LIMITS, ...limits };

  const handleFileChange = (kind: RefKind, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onAdd(kind, files);
    e.target.value = "";
  };

  const activeItems = items.filter((i) => i.kind === activeKind);
  const activeLimit = resolvedLimits[activeKind];
  const canAddMore = activeItems.length < activeLimit;

  return (
    <div className="space-y-2.5">
      <Label className="text-xs font-medium">{label}</Label>

      {/* Bucket selector — 3-col pill grid, styled like IconPillSelector */}
      <div className="grid grid-cols-3 gap-1.5">
        {KINDS.map((kind) => {
          const { icon: Icon, label: kindLabel } = KIND_META[kind];
          const count = items.filter((i) => i.kind === kind).length;
          const limit = resolvedLimits[kind];
          const isActive = activeKind === kind;

          return (
            <button
              key={kind}
              type="button"
              onClick={() => onActiveKindChange(kind)}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 px-2 text-[10px] font-semibold leading-none transition-all duration-150 select-none outline-none border focus-visible:ring-2 focus-visible:ring-ring/50",
                isActive
                  ? [
                      "bg-primary text-primary-foreground border-primary",
                      "shadow-[0_0_12px_-2px_var(--color-primary)] shadow-primary/40",
                    ]
                  : [
                      "bg-white/4 border-white/10 text-muted-foreground",
                      "hover:bg-white/8 hover:border-white/20 hover:text-foreground",
                      "active:scale-[0.97]",
                    ],
              )}
            >
              {!isActive && (
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-linear-to-b from-white/4 to-transparent" />
              )}
              <Icon size={13} className="shrink-0" />
              <span className="tracking-wide">{kindLabel}</span>
              <span
                className={cn(
                  "text-[9px] leading-none tabular-nums",
                  isActive ? "text-primary-foreground/70" : "text-muted-foreground/60",
                )}
              >
                {count}/{limit}
              </span>
            </button>
          );
        })}
      </div>

      {/* Thumbnail strip for active bucket */}
      <div className="flex flex-wrap gap-2">
        {activeItems.map((item) => (
          <div
            key={item.id}
            className="group relative w-16 aspect-square rounded-lg overflow-hidden border border-border shrink-0"
          >
            {item.kind === "image" && (
              <Image
                src={item.previewUrl}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            )}
            {item.kind === "video" && (
              <video
                src={item.previewUrl}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
            )}
            {item.kind === "audio" && (
              <div className="w-full h-full flex items-center justify-center bg-muted/60">
                <Music size={18} className="text-muted-foreground" />
              </div>
            )}

            {/* Remove overlay */}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ))}

        {/* Add tile */}
        {canAddMore && (
          <>
            <input
              ref={(el) => { inputRefs.current[activeKind] = el; }}
              type="file"
              accept={KIND_META[activeKind].accept}
              multiple
              className="sr-only"
              onChange={(e) => handleFileChange(activeKind, e)}
            />
            <button
              type="button"
              onClick={() => inputRefs.current[activeKind]?.click()}
              className="w-16 aspect-square rounded-lg border-2 border-dashed border-border/60 flex items-center justify-center text-muted-foreground/50 hover:border-border hover:text-muted-foreground transition-colors shrink-0"
              aria-label={`Add ${KIND_META[activeKind].label}`}
            >
              <Plus size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

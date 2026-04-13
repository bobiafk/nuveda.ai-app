"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileImage, FileAudio, FileVideo } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  accept: "image" | "audio" | "video";
  label?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
}

const acceptMap = {
  image: { mime: "image/*", icon: FileImage, text: "Drop an image here or click to browse" },
  audio: { mime: "audio/*", icon: FileAudio, text: "Drop an audio file here or click to browse" },
  video: { mime: "video/*", icon: FileVideo, text: "Drop a video file here or click to browse" },
};

export function FileUploadZone({
  accept,
  label,
  value,
  onChange,
  className,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const config = acceptMap[accept];

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onChange(file);
    },
    [onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onChange(file);
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-xs font-medium">{label}</Label>}

      {value ? (
        <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
          <config.icon size={18} className="text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-[11px] text-muted-foreground">
              {(value.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => onChange(null)}
          >
            <X size={14} />
          </Button>
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.03] p-8 cursor-pointer transition-colors",
            isDragging && "border-primary bg-primary/10"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload
            size={24}
            className={cn(
              "text-muted-foreground",
              isDragging && "text-primary"
            )}
          />
          <p className="text-xs text-muted-foreground text-center">
            {config.text}
          </p>
          <input
            type="file"
            accept={config.mime}
            className="sr-only"
            onChange={handleChange}
          />
        </label>
      )}
    </div>
  );
}

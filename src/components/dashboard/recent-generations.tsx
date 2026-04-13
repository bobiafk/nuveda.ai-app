"use client";

import { Image, Music, Mic, Film, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface RecentItem {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  color: string;
  icon: React.ElementType;
}

const recentItems: RecentItem[] = [
  { id: "1", type: "Image", title: "Sunset landscape with mountains", timestamp: "2 min ago", color: "#8B5CF6", icon: Image },
  { id: "2", type: "Music", title: "Lo-fi chill beat, 90 BPM", timestamp: "15 min ago", color: "#EC4899", icon: Music },
  { id: "3", type: "Audio", title: "Product demo narration", timestamp: "1 hr ago", color: "#10B981", icon: Mic },
  { id: "4", type: "Image", title: "Futuristic city at night", timestamp: "2 hr ago", color: "#8B5CF6", icon: Image },
  { id: "5", type: "Video", title: "Avatar presentation clip", timestamp: "3 hr ago", color: "#D946EF", icon: Film },
  { id: "6", type: "Image", title: "Abstract gradient art", timestamp: "5 hr ago", color: "#8B5CF6", icon: Image },
];

export function RecentGenerations() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold font-[family-name:var(--font-display)]">
          Recent Generations
        </h2>
        <a
          href="/dashboard/history"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          View all
        </a>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="shrink-0 w-48 rounded-xl glass border border-white/10 overflow-hidden group hover:border-white/15 transition-colors cursor-pointer"
            >
              <div
                className="h-28 flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
                }}
              >
                <item.icon size={28} style={{ color: item.color }} className="opacity-40" />
                <Badge
                  variant="secondary"
                  className="absolute top-2 left-2 text-[10px] px-1.5 py-0 h-5"
                >
                  {item.type}
                </Badge>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                  <Clock size={9} />
                  {item.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

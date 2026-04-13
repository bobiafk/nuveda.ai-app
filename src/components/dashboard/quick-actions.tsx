"use client";

import Link from "next/link";
import { Image, UserCircle, Sparkles, Music, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "New Image", icon: Image, href: "/dashboard/image-generation", color: "#8B5CF6" },
  { label: "Avatar Video", icon: UserCircle, href: "/dashboard/ai-avatar-video", color: "#D946EF" },
  { label: "Optimize Prompt", icon: Sparkles, href: "/dashboard/prompt-optimizer", color: "#EAB308" },
  { label: "Create Music", icon: Music, href: "/dashboard/music-generation", color: "#EC4899" },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 border-border hover:border-white/15 hover:bg-white/8 transition-all"
          >
            <action.icon size={14} style={{ color: action.color }} />
            {action.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}

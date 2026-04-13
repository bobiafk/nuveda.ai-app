import {
  Image,
  Mic,
  Music,
  ArrowUpCircle,
  Film,
  AudioLines,
  UserCircle,
  Captions,
  Move3D,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  route: string;
  gradientFrom: string;
  gradientTo: string;
  inputTypes: ("text" | "image" | "audio" | "video")[];
  creditCost: number;
}

export const features: Feature[] = [
  {
    id: "image-generation",
    name: "Image Generation",
    description: "Create stunning images from text prompts with AI-powered generation models.",
    icon: Image,
    route: "/dashboard/image-generation",
    gradientFrom: "#8B5CF6",
    gradientTo: "#A855F7",
    inputTypes: ["text"],
    creditCost: 5,
  },
  {
    id: "audio-generation",
    name: "Audio Generation",
    description: "Generate high-quality audio content from text descriptions.",
    icon: Mic,
    route: "/dashboard/audio-generation",
    gradientFrom: "#10B981",
    gradientTo: "#14B8A6",
    inputTypes: ["text"],
    creditCost: 3,
  },
  {
    id: "music-generation",
    name: "Music Generation",
    description: "Compose original music tracks with customizable genre, mood, and tempo.",
    icon: Music,
    route: "/dashboard/music-generation",
    gradientFrom: "#EC4899",
    gradientTo: "#F43F5E",
    inputTypes: ["text"],
    creditCost: 8,
  },
  {
    id: "image-upscaling",
    name: "Image Upscaling",
    description: "Enhance and upscale images to higher resolutions with AI super-resolution.",
    icon: ArrowUpCircle,
    route: "/dashboard/image-upscaling",
    gradientFrom: "#F59E0B",
    gradientTo: "#F97316",
    inputTypes: ["image"],
    creditCost: 2,
  },
  {
    id: "video-upscaling",
    name: "Video Upscaling",
    description: "Upscale video resolution and enhance quality with frame interpolation.",
    icon: Film,
    route: "/dashboard/video-upscaling",
    gradientFrom: "#06B6D4",
    gradientTo: "#3B82F6",
    inputTypes: ["video"],
    creditCost: 10,
  },
  {
    id: "voice-generation",
    name: "Voice Generation",
    description: "Generate natural-sounding voices from text with emotion and style control.",
    icon: AudioLines,
    route: "/dashboard/voice-generation",
    gradientFrom: "#6366F1",
    gradientTo: "#8B5CF6",
    inputTypes: ["text", "audio"],
    creditCost: 4,
  },
  {
    id: "ai-avatar-video",
    name: "AI Avatar Video",
    description: "Create realistic avatar videos with custom scripts and expressions.",
    icon: UserCircle,
    route: "/dashboard/ai-avatar-video",
    gradientFrom: "#D946EF",
    gradientTo: "#EC4899",
    inputTypes: ["text", "image", "audio"],
    creditCost: 15,
  },
  {
    id: "caption-generator",
    name: "Caption Generator",
    description: "Auto-generate accurate captions and subtitles for your video content.",
    icon: Captions,
    route: "/dashboard/caption-generator",
    gradientFrom: "#0EA5E9",
    gradientTo: "#06B6D4",
    inputTypes: ["video"],
    creditCost: 3,
  },
  {
    id: "kling-motion",
    name: "Kling Motion Control",
    description: "Animate still images with precise motion and camera control.",
    icon: Move3D,
    route: "/dashboard/kling-motion",
    gradientFrom: "#84CC16",
    gradientTo: "#10B981",
    inputTypes: ["image"],
    creditCost: 12,
  },
  {
    id: "prompt-optimizer",
    name: "Prompt Optimizer",
    description: "Enhance your prompts with AI to get significantly better generation results.",
    icon: Sparkles,
    route: "/dashboard/prompt-optimizer",
    gradientFrom: "#EAB308",
    gradientTo: "#F59E0B",
    inputTypes: ["text"],
    creditCost: 1,
  },
];

export function getFeatureById(id: string): Feature | undefined {
  return features.find((f) => f.id === id);
}

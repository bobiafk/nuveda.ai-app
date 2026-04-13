"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Settings,
  CreditCard,
  Menu,
  Zap,
  Sun,
  Moon,
  Pin,
  PinOff,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { features } from "@/lib/features";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMobile } from "@/hooks/use-mobile";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Billing", href: "/dashboard/subscription", icon: CreditCard },
];

function SidebarNavItem({
  item,
  isActive,
  expanded,
}: {
  item: NavItem;
  isActive: boolean;
  expanded: boolean;
}) {
  const inner = (
    <Link href={item.href} className="block">
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 cursor-pointer overflow-hidden",
          expanded ? "" : "justify-center",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-r-full bg-primary" />
        )}
        <item.icon
          size={20}
          strokeWidth={isActive ? 2 : 1.5}
          className={cn("shrink-0 transition-colors", isActive && "text-primary")}
        />
        <span
          className={cn(
            "text-sm font-medium truncate transition-all duration-300",
            expanded
              ? "opacity-100 w-auto"
              : "opacity-0 w-0 overflow-hidden"
          )}
        >
          {item.label}
        </span>
      </div>
    </Link>
  );

  if (expanded) return inner;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{inner}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={12}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarToolItem({
  feature,
  isActive,
  expanded,
}: {
  feature: (typeof features)[number];
  isActive: boolean;
  expanded: boolean;
}) {
  const FeatureIcon = feature.icon;
  const inner = (
    <Link href={feature.route} className="block">
      <div
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 cursor-pointer",
          expanded ? "" : "justify-center",
          isActive
            ? "text-sidebar-accent-foreground font-semibold"
            : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        <FeatureIcon
          size={20}
          strokeWidth={isActive ? 2.25 : 1.5}
          className="shrink-0 transition-colors"
          style={isActive ? { color: feature.gradientFrom } : undefined}
        />
        <span
          className={cn(
            "text-sm truncate transition-all duration-300",
            expanded
              ? "opacity-100 w-auto"
              : "opacity-0 w-0 overflow-hidden"
          )}
        >
          {feature.name}
        </span>
      </div>
    </Link>
  );

  if (expanded) return inner;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{inner}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={12}>
        {feature.name}
      </TooltipContent>
    </Tooltip>
  );
}

function DesktopSidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => setMounted(true), []);

  const isToolActive = features.some((f) => pathname.startsWith(f.route));
  const expanded = pinned || hovered || isToolActive;

  const handleMouseEnter = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setHovered(false), 300);
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <>
      {/* Spacer in document flow */}
      <div
        className={cn(
          "hidden md:block shrink-0 transition-all duration-300",
          expanded ? "w-60" : "w-17"
        )}
      />

      {/* Sidebar */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "hidden md:flex fixed left-0 top-0 h-screen flex-col z-40 overflow-hidden transition-all duration-300 ease-in-out",
          "bg-sidebar border-r border-sidebar-border backdrop-blur-2xl",
          expanded ? "w-60" : "w-17"
        )}
      >
        {/* Brand header */}
        <div
          className={cn(
            "flex items-center shrink-0 h-14 px-3",
            expanded ? "justify-between" : "justify-center"
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <Zap size={18} className="text-white" />
            </div>
            <div
              className={cn(
                "flex flex-col min-w-0 transition-all duration-300",
                expanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
              )}
            >
              <span className="text-sm font-bold tracking-tight font-display truncate">
                EliteFans
              </span>
              <span className="text-[9px] text-sidebar-foreground/40 uppercase tracking-wider">
                AI Studio
              </span>
            </div>
          </div>
          {expanded && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setPinned((p) => !p)}
                  className={cn(
                    "h-7 w-7 flex items-center justify-center rounded-lg transition-all duration-200 shrink-0",
                    pinned
                      ? "bg-primary/15 text-primary"
                      : "text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  {pinned ? <PinOff size={14} /> : <Pin size={14} />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {pinned ? "Unpin sidebar" : "Pin sidebar"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 h-px bg-sidebar-border" />

        {/* Main nav */}
        <nav className="flex flex-col gap-0.5 px-2 pt-3 shrink-0">
          {navItems.slice(0, 1).map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              expanded={expanded}
            />
          ))}
        </nav>

        {/* AI Tools section */}
        <div className="mx-3 my-2 h-px bg-sidebar-border" />

        {expanded && (
          <div className="flex items-center justify-between px-4 py-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/30">
              AI Tools
            </p>
            <ChevronRight size={12} className="text-sidebar-foreground/20" />
          </div>
        )}

        <ScrollArea className="flex-1 min-h-0 px-2">
          <div className="flex flex-col gap-0.5 pb-2">
            {features.map((feature) => (
              <SidebarToolItem
                key={feature.id}
                feature={feature}
                isActive={pathname.startsWith(feature.route)}
                expanded={expanded}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Bottom divider */}
        <div className="mx-3 h-px bg-sidebar-border" />

        {/* Bottom nav */}
        <nav className="flex flex-col gap-0.5 px-2 py-2 shrink-0">
          {navItems.slice(1).map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              expanded={expanded}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="mx-3 h-px bg-sidebar-border" />
        <div
          className={cn(
            "flex items-center shrink-0 px-3 py-3 gap-2",
            expanded ? "justify-between" : "flex-col"
          )}
        >
          {/* User */}
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-2.5 min-w-0 rounded-xl px-1 py-1 transition-colors hover:bg-sidebar-accent",
              !expanded && "justify-center px-0"
            )}
          >
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-sidebar-border">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            {expanded && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate leading-tight">
                  John Doe
                </span>
                <span className="text-[10px] text-sidebar-foreground/40 leading-tight">
                  Pro Plan
                </span>
              </div>
            )}
          </Link>

          {/* Actions row */}
          <div className={cn("flex items-center gap-1", !expanded && "flex-col")}>
            {/* Theme toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 shrink-0"
                >
                  {mounted ? (
                    isDark ? (
                      <Sun size={16} />
                    ) : (
                      <Moon size={16} />
                    )
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {mounted ? (isDark ? "Light mode" : "Dark mode") : "Toggle theme"}
              </TooltipContent>
            </Tooltip>

            {/* Credits */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/subscription">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-200 shrink-0">
                    <Zap size={14} className="text-primary" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                847 credits remaining
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </>
  );
}

function MobileSidebarContent({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Zap size={18} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight font-display">
            EliteFans
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            AI Studio
          </span>
        </div>
      </div>

      <div className="mx-4 h-px bg-border" />

      <ScrollArea className="flex-1 px-3 py-3">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <div
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors overflow-hidden",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {isActive(item.href) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-r-full bg-primary" />
                )}
                <item.icon
                  size={18}
                  className={cn(isActive(item.href) && "text-primary")}
                />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mx-1 my-4 h-px bg-border" />

        <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          AI Tools
        </p>
        <div className="space-y-0.5">
          {features.map((feature) => {
            const active = pathname.startsWith(feature.route);
            const FeatureIcon = feature.icon;
            return (
              <Link
                key={feature.id}
                href={feature.route}
                onClick={onClose}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    active
                      ? "text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <FeatureIcon
                    size={20}
                    strokeWidth={active ? 2.25 : 1.5}
                    className="shrink-0"
                    style={active ? { color: feature.gradientFrom } : undefined}
                  />
                  <span className="truncate">{feature.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">John Doe</span>
            <span className="text-[11px] text-muted-foreground">Pro Plan</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {mounted ? (
            isDark ? <Sun size={14} /> : <Moon size={14} />
          ) : (
            <div className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-3 left-3 z-50 md:hidden h-10 w-10 rounded-xl glass border-border"
          >
            <Menu size={18} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
          <MobileSidebarContent onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return <DesktopSidebar />;
}

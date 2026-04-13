"use client";

import { useState } from "react";
import { User, Bell, Link2, Key, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-8 animate-fade-in">
      <PageHeader title="Settings" subtitle="Manage your account preferences" />

      {/* Profile */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <User size={16} className="text-primary" />
          Profile
        </div>
        <div className="rounded-xl glass border border-border p-5 space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="rounded-xl text-xs">
                Change avatar
              </Button>
              <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl bg-input/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl bg-input/50 border-border"
              />
            </div>
          </div>

          <Button size="sm" className="rounded-xl gap-1.5 gradient-primary text-white border-0 hover:opacity-90">
            <Save size={14} />
            Save Changes
          </Button>
        </div>
      </section>

      {/* Connected Accounts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Link2 size={16} className="text-primary" />
          Connected Accounts
        </div>
        <div className="rounded-xl glass border border-border p-5 space-y-4">
          {[
            { name: "Google", connected: true },
            { name: "GitHub", connected: false },
            { name: "Discord", connected: false },
          ].map((account) => (
            <div key={account.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{account.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {account.connected ? "Connected" : "Not connected"}
                </p>
              </div>
              <Button
                variant={account.connected ? "outline" : "default"}
                size="sm"
                className="rounded-xl text-xs"
              >
                {account.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Bell size={16} className="text-primary" />
          Notifications
        </div>
        <div className="rounded-xl glass border border-border p-5 space-y-4">
          {[
            { label: "Generation completed", description: "Notify when a generation finishes", defaultChecked: true },
            { label: "Credit alerts", description: "Alert when credits are running low", defaultChecked: true },
            { label: "Product updates", description: "New features and improvements", defaultChecked: false },
            { label: "Marketing emails", description: "Tips, guides, and promotions", defaultChecked: false },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-[11px] text-muted-foreground">{pref.description}</p>
              </div>
              <Switch defaultChecked={pref.defaultChecked} />
            </div>
          ))}
        </div>
      </section>

      {/* API Keys */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Key size={16} className="text-primary" />
          API Keys
        </div>
        <div className="rounded-xl glass border border-border p-5">
          <p className="text-sm text-muted-foreground mb-3">
            API access is available on Professional and Enterprise plans.
          </p>
          <div className="flex items-center gap-2">
            <Input
              value="sk-••••••••••••••••••••••••"
              readOnly
              className="rounded-xl bg-input/50 border-border font-mono text-xs"
            />
            <Button variant="outline" size="sm" className="rounded-xl text-xs shrink-0">
              Regenerate
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

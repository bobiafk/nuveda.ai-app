"use client";

import { useState } from "react";
import { User, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 md:p-6 max-w-xl mx-auto space-y-8 animate-fade-in">
        <PageHeader title="Settings" subtitle="Manage your profile information" />

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
      </div>
    </div>
  );
}

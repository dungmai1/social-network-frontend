"use client";

import Header from "@/components/layout/Header";
import { SettingsSkeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="flex gap-2 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-24 bg-muted rounded-lg" />
              ))}
            </div>
            <SettingsSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

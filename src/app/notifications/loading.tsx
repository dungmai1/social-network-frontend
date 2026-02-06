"use client";

import Header from "@/components/layout/Header";

export default function NotificationsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Header skeleton */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-muted rounded-xl animate-pulse" />
              <div className="h-6 w-36 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-8 w-28 bg-muted rounded-lg animate-pulse" />
          </div>

          {/* Notification items skeleton */}
          <div className="divide-y divide-border">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <div className="w-11 h-11 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/4 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

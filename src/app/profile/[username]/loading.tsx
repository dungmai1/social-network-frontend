"use client";

import Header from "@/components/layout/Header";
import { ProfileHeaderSkeleton, FeedSkeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <ProfileHeaderSkeleton />
        <FeedSkeleton count={2} />
      </div>
    </div>
  );
}

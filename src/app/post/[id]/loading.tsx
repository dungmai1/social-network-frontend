"use client";

import Header from "@/components/layout/Header";
import { PostSkeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function PostLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Back button */}
        <div className="mb-4 flex items-center gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </div>
        
        <PostSkeleton />
      </div>
    </div>
  );
}

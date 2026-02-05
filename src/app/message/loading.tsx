"use client";

import Header from "@/components/layout/Header";
import { MessageSquare, Loader2 } from "lucide-react";

export default function MessageLoading() {
  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/25">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading messages...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

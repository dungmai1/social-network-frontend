"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import "@cometchat/chat-uikit-react/css-variables.css";
import Header from "@/components/layout/Header";
import { MessageSquare, Loader2 } from "lucide-react";

// Dynamically import CometChat component with SSR disabled
const CometChatComponent = dynamic(
  () => import("@/CometChat/CometChatNoSSR/CometChatNoSSR"),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary via-secondary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/25 animate-pulse">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Loading Conversation
          </h3>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Connecting to chat...</span>
          </div>
        </div>
      </div>
    ),
  },
);

export default function MessageWithUser() {
  const params = useParams();
  const username = params.username as string;
  
  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/3 rounded-full blur-3xl" />
        </div>
        
        {/* CometChat wrapper */}
        <div className="relative z-10 h-full">
          <CometChatComponent initialUsername={username} />
        </div>
      </div>
    </div>
  );
}

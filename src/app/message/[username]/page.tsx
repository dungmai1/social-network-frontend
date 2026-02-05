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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary via-secondary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/25">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading conversation...</span>
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
        </div>
        
        {/* CometChat wrapper */}
        <div className="relative z-10 h-full [&_.cometchat]:bg-transparent [&_.cometchat]:h-full">
          <CometChatComponent initialUsername={username} />
        </div>
      </div>
    </div>
  );
}

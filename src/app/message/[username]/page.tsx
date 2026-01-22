"use client";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import "@cometchat/chat-uikit-react/css-variables.css";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

// Dynamically import CometChat component with SSR disabled
const CometChatComponent = dynamic(
  () => import("@/CometChat/CometChatNoSSR/CometChatNoSSR"),
  {
    ssr: false,
  },
);

export default function MessageWithUser() {
  const params = useParams();
  const username = params.username as string;
  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden">
        <CometChatComponent initialUsername={username} />
      </div>
    </div>
  );
}

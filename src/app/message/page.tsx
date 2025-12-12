"use client";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

import "@cometchat/chat-uikit-react/css-variables.css";
import Header from "../(home)/components/Header";

const inter = Inter({ subsets: ["latin"] });

// Dynamically import CometChat component with SSR disabled
const CometChatComponent = dynamic(
  () => import("@/CometChatNoSSR/CometChatNoSSR"),
  {
    ssr: false,
  }
);

export default function Message() {
  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden">
        <CometChatComponent />
      </div>
    </div>
  );
}

"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { NotificationBell } from "@/components/notification";
import { SearchBar } from "@/components/search";

export default function Header() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogOut = async () => {
    try {
      await CometChatUIKit.logout()
        .then(() => {
          console.log("Logout success");
        })
        .catch((error) => {
          console.log("Logout error:", error);
        });
      console.log("CometChat logout successful");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };
  useEffect(() => {
    CometChat.getUnreadMessageCount().then((res) => {
      const users = (res as any).users || {};
      setUnreadCount(Object.keys(users).length);
    });
  }, []);
  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="mx-auto px-4 lg:px-6 py-3 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <img
              src="/insta-logo.svg"
              alt="Instagram"
              className="h-8 hidden sm:block"
            />
            <svg
              className="w-7 h-7 sm:hidden"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="18" cy="6" r="1.5" fill="currentColor" />
            </svg>
          </Link>
        </div>

        {/* Search */}
        <div className="hidden md:block">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link href="/" className="hidden md:block">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" />
              </svg>
            </button>
          </Link>

          <Link href="/message" className="hidden md:block">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
              <MessageCircle size={24} className="text-gray-800" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </Link>

          <NotificationBell />

          <button
            onClick={() => handleLogOut()}
            className="ml-2 px-4 py-1.5 text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

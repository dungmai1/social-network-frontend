"use client";

import { MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { NotificationBell } from "@/components/notification";

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
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-20">
      <div className="mx-auto px-6 py-3 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-4">
          <Link href="/">
            <div className="text-2xl font-bold text-gray-900 select-none">
              Instagram
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 text-sm bg-gray-50">
            <Search size={18} className="text-gray-500" />
            <input
              className="bg-transparent outline-none w-36 sm:w-64 text-gray-700 placeholder-gray-500 text-sm"
              placeholder="Search"
            />
          </div>
          <NotificationBell />
          <Link href="/message" aria-label="Open CometChat">
            <div className="p-2 rounded-lg hover:bg-gray-100 transition relative">
              <MessageCircle size={20} className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
          </Link>
          <button
            onClick={() => handleLogOut()}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition text-red-600 font-semibold border border-red-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

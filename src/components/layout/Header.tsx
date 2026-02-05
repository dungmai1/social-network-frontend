"use client";

import {
  MessageCircle,
  Home,
  Search,
  PlusSquare,
  Moon,
  Sun,
  Monitor,
  LogOut,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/notification";
import { SearchBar } from "@/components/search";
import { useTheme } from "@/providers/ThemeProvider";
import useUser from "@/hooks/useUser";

export default function Header() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { userCurrent } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const handleLogOut = async () => {
    try {
      const { CometChatUIKit } = await import("@cometchat/chat-uikit-react");
      await CometChatUIKit.logout();
      console.log("CometChat logout successful");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    import("@cometchat/chat-sdk-javascript").then(({ CometChat }) => {
      CometChat.getUnreadMessageCount()
        .then((res) => {
          const users = (res as any).users || {};
          setUnreadCount(Object.keys(users).length);
        })
        .catch((error) => {
          console.log("Failed to get unread count:", error);
        });
    });
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ThemeIcon = () => {
    if (theme === "system") return <Monitor size={18} />;
    if (resolvedTheme === "dark") return <Moon size={18} />;
    return <Sun size={18} />;
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Floating Navbar Container */}
      <div className="mx-auto max-w-7xl px-4 pt-3">
        <nav className="glass-card rounded-2xl shadow-lg px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="hidden sm:block text-xl font-bold font-heading gradient-text">
                SocialHub
              </span>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Home */}
              <Link href="/">
                <button className="p-2.5 rounded-xl hover:bg-accent/50 text-foreground transition-colors cursor-pointer">
                  <Home size={22} />
                </button>
              </Link>

              {/* Messages */}
              <Link href="/message" className="hidden sm:block">
                <button className="p-2.5 rounded-xl hover:bg-accent/50 text-foreground transition-colors relative cursor-pointer">
                  <MessageCircle size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 pulse-dot">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Notifications */}
              <NotificationBell />

              {/* Theme Toggle */}
              <div className="relative" ref={themeMenuRef}>
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2.5 rounded-xl hover:bg-accent/50 text-foreground transition-colors cursor-pointer"
                  aria-label="Toggle theme"
                >
                  <ThemeIcon />
                </button>

                {showThemeMenu && (
                  <div className="absolute right-0 mt-2 w-40 glass-card rounded-xl shadow-xl overflow-hidden z-50">
                    <button
                      onClick={() => {
                        setTheme("light");
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent/50 transition-colors cursor-pointer ${
                        theme === "light"
                          ? "text-primary font-medium"
                          : "text-foreground"
                      }`}
                    >
                      <Sun size={16} />
                      Light
                    </button>
                    <button
                      onClick={() => {
                        setTheme("dark");
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent/50 transition-colors cursor-pointer ${
                        theme === "dark"
                          ? "text-primary font-medium"
                          : "text-foreground"
                      }`}
                    >
                      <Moon size={16} />
                      Dark
                    </button>
                    <button
                      onClick={() => {
                        setTheme("system");
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent/50 transition-colors cursor-pointer ${
                        theme === "system"
                          ? "text-primary font-medium"
                          : "text-foreground"
                      }`}
                    >
                      <Monitor size={16} />
                      System
                    </button>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative ml-1" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/30">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        userCurrent?.avatar ||
                        `https://picsum.photos/seed/${userCurrent?.username || "user"}/100`
                      }
                      alt={userCurrent?.username || "User"}
                    />
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-muted-foreground transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-xl overflow-hidden z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-foreground">
                        {userCurrent?.displayname || userCurrent?.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{userCurrent?.username}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href={`/profile/${userCurrent?.username}`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors cursor-pointer">
                          <User size={16} />
                          View Profile
                        </button>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors cursor-pointer">
                          <Settings size={16} />
                          Settings
                        </button>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogOut();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

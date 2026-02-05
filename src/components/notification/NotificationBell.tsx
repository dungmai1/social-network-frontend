"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { getUnreadCount } from "@/services/notification.service";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    // Refresh unread count when closing
    fetchUnreadCount();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2.5 rounded-xl hover:bg-accent/50 text-foreground transition-colors relative cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 pulse-dot">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      <NotificationDropdown isOpen={isOpen} onClose={closeDropdown} />
    </div>
  );
}

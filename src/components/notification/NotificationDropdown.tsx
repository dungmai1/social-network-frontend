"use client";

import { useEffect, useRef } from "react";
import { useNotification } from "@/hooks/useNotification";
import NotificationItem from "./NotificationItem";
import { Bell, Check, Loader2 } from "lucide-react";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
  } = useNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle scroll for infinite loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading) {
      loadMore();
    }
  };

  const handleMarkAsRead = (id: number) => {
    markAsRead([id]);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-gray-600" />
          <span className="font-semibold text-gray-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <Check size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-[400px] overflow-y-auto" onScroll={handleScroll}>
        {notifications.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Bell size={40} className="text-gray-300 mb-3" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={deleteNotification}
              />
            ))}
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            )}
            {!hasMore && notifications.length > 0 && (
              <div className="text-center py-4 text-sm text-gray-400">
                No more notifications
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

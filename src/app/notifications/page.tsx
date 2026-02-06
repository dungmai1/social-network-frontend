"use client";

import { useCallback, useRef } from "react";
import { Bell, Check, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { NotificationItem } from "@/components/notification";
import { useNotification } from "@/hooks/useNotification";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    totalElements,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
  } = useNotification();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleMarkAsRead = (id: number) => {
    markAsRead([id]);
  };

  // Infinite scroll using intersection observer
  useIntersectionObserver({
    target: loadMoreRef as React.RefObject<Element>,
    onIntersect: useCallback(() => {
      if (hasMore && !loading) {
        loadMore();
      }
    }, [hasMore, loading, loadMore]),
    enabled: hasMore && !loading,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Link href="/">
                <button className="p-2 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer">
                  <ArrowLeft size={20} className="text-foreground" />
                </button>
              </Link>
              <div className="flex items-center gap-2">
                <Bell size={22} className="text-primary" />
                <h1 className="text-xl font-bold text-foreground">
                  Notifications
                </h1>
                {totalElements > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({totalElements})
                  </span>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 font-medium rounded-lg transition-colors cursor-pointer"
              >
                <Check size={16} />
                Mark all read
              </button>
            )}
          </div>

          {/* Unread count banner */}
          {unreadCount > 0 && (
            <div className="px-6 py-2.5 bg-primary/5 border-b border-border">
              <p className="text-sm text-primary font-medium">
                You have {unreadCount} unread notification
                {unreadCount > 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Notification List */}
          <div>
            {notifications.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Bell size={36} className="text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground">
                  No notifications yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  When you get notifications, they&apos;ll show up here
                </p>
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

                {/* Load more trigger */}
                {hasMore && (
                  <div
                    ref={loadMoreRef}
                    className="flex items-center justify-center py-6"
                  >
                    <Loader2 size={24} className="animate-spin text-primary" />
                  </div>
                )}

                {loading && !hasMore && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 size={20} className="animate-spin text-primary" />
                  </div>
                )}

                {!hasMore && notifications.length > 0 && (
                  <div className="text-center py-6 text-sm text-muted-foreground border-t border-border">
                    You&apos;ve seen all your notifications
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

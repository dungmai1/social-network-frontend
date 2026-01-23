import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/services/notification.service";
import { NotificationModel } from "@/types/notification";

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (pageNum: number = 1, limit: number = 20, reset: boolean = false) => {
      setLoading(true);
      try {
        const data = await getNotifications(pageNum, limit);
        if (data) {
          if (reset || pageNum === 1) {
            setNotifications(data.notifications);
          } else {
            setNotifications((prev) => [...prev, ...data.notifications]);
          }
          setHasMore(data.hasNext);
          setPage(pageNum);
          setTotalElements(data.totalElements);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, []);

  // Mark specific notifications as read
  const handleMarkAsRead = useCallback(async (notificationIds: number[]) => {
    try {
      const result = await markAsRead(notificationIds);
      if (result) {
        setNotifications((prev) =>
          prev.map((n) =>
            notificationIds.includes(n.id) ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }, []);

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const result = await markAllAsRead();
      if (result) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, []);

  // Delete a notification
  const handleDeleteNotification = useCallback(
    async (notificationId: number) => {
      try {
        const success = await deleteNotification(notificationId);
        if (success) {
          const notification = notifications.find(
            (n) => n.id === notificationId,
          );
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId),
          );
          if (notification && !notification.isRead) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
          setTotalElements((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [notifications],
  );

  // Load more notifications
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1);
    }
  }, [hasMore, loading, page, fetchNotifications]);

  // Refresh notifications
  const refresh = useCallback(() => {
    fetchNotifications(1, 20, true);
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications(1);
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Poll for unread count every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    hasMore,
    totalElements,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    loadMore,
    refresh,
  };
}

import { apiFetch } from "@/lib/api";
import {
  NotificationPageResponse,
  UnreadCountResponse,
  MarkedCountResponse,
} from "@/types/notification";

const URL_BASE = "/notifications";

// Get paginated notifications list
export async function getNotifications(
  page: number = 1,
  limit: number = 20,
): Promise<NotificationPageResponse | null> {
  try {
    const res = await apiFetch(`${URL_BASE}?page=${page}&limit=${limit}`, {
      method: "GET",
    });
    if (!res.ok) {
      console.error("Error fetching notifications");
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
}

// Get unread notification count
export async function getUnreadCount(): Promise<number> {
  try {
    const res = await apiFetch(`${URL_BASE}/unread-count`, {
      method: "GET",
    });
    if (!res.ok) {
      console.error("Error fetching unread count");
      return 0;
    }
    const data = await res.json();
    return data.unreadCount;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
}

// Mark as read (one or many)
export async function markAsRead(
  notificationIds: number[],
): Promise<MarkedCountResponse | null> {
  try {
    const res = await apiFetch(`${URL_BASE}/mark-read`, {
      method: "PUT",
      body: JSON.stringify({ notificationIds }),
    });
    if (!res.ok) {
      console.error("Error marking notifications as read");
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return null;
  }
}

// Mark all as read
export async function markAllAsRead(): Promise<MarkedCountResponse | null> {
  try {
    const res = await apiFetch(`${URL_BASE}/mark-all-read`, {
      method: "PUT",
    });
    if (!res.ok) {
      console.error("Error marking all notifications as read");
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return null;
  }
}

// Delete notification
export async function deleteNotification(
  notificationId: number,
): Promise<boolean> {
  try {
    const res = await apiFetch(`${URL_BASE}/${notificationId}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (error) {
    console.error("Error deleting notification:", error);
    return false;
  }
}

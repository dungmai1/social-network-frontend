import { apiFetch } from "@/lib/api";
import {
  NotificationPageResponse,
  UnreadCountResponse,
  MarkedCountResponse,
} from "@/types/notification";

const URL_BASE = "/notifications";

// Lấy danh sách notifications có phân trang
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

// Lấy số lượng notification chưa đọc
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

// Đánh dấu đã đọc (một hoặc nhiều)
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

// Đánh dấu tất cả đã đọc
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

// Xóa notification
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

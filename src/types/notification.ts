// types/notification.ts

export type NotificationType =
  | "LIKE_POST"
  | "LIKE_COMMENT"
  | "COMMENT"
  | "REPLY"
  | "FOLLOW"
  | "MENTION";

export interface NotificationActor {
  id: number;
  username: string;
  displayname: string;
  avatar: string | null;
}

export interface NotificationModel {
  id: number;
  actor: NotificationActor;
  type: NotificationType;
  targetId: number | null;
  relatedId: number | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPageResponse {
  notifications: NotificationModel[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface MarkedCountResponse {
  markedCount: number;
}

export interface MarkReadRequest {
  notificationIds: number[];
}

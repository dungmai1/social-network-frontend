"use client";

import { NotificationModel, NotificationType } from "@/types/notification";
import { getTimeAgo } from "@/lib/timeAgo";
import { X, Heart, MessageCircle, UserPlus, AtSign, Reply } from "lucide-react";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: NotificationModel;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

// Simple avatar component for notifications
const NotificationAvatar = ({
  src,
  alt,
  size = 44,
}: {
  src?: string | null;
  alt: string;
  size?: number;
}) => (
  <div
    className="rounded-full overflow-hidden bg-gray-200 flex-shrink-0"
    style={{ width: size, height: size }}
  >
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-sm">
        {alt.charAt(0).toUpperCase()}
      </div>
    )}
  </div>
);

interface NotificationItemProps {
  notification: NotificationModel;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

// Get icon based on notification type
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "LIKE_POST":
    case "LIKE_COMMENT":
      return <Heart size={16} className="text-red-500 fill-red-500" />;
    case "COMMENT":
      return <MessageCircle size={16} className="text-green-500" />;
    case "REPLY":
      return <Reply size={16} className="text-blue-500" />;
    case "FOLLOW":
      return <UserPlus size={16} className="text-purple-500" />;
    case "MENTION":
      return <AtSign size={16} className="text-orange-500" />;
    default:
      return null;
  }
};

// Get background color based on notification type
const getIconBgColor = (type: NotificationType) => {
  switch (type) {
    case "LIKE_POST":
    case "LIKE_COMMENT":
      return "bg-red-100";
    case "COMMENT":
      return "bg-green-100";
    case "REPLY":
      return "bg-blue-100";
    case "FOLLOW":
      return "bg-purple-100";
    case "MENTION":
      return "bg-orange-100";
    default:
      return "bg-gray-100";
  }
};

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    // Mark as read first
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "LIKE_POST":
      case "COMMENT":
      case "MENTION":
        // targetId = postId
        if (notification.targetId) {
          router.push(`/post/${notification.targetId}`);
        }
        break;

      case "LIKE_COMMENT":
        // targetId = commentId, relatedId = postId
        if (notification.relatedId) {
          router.push(
            `/post/${notification.relatedId}?commentId=${notification.targetId}`,
          );
        }
        break;

      case "REPLY":
        // targetId = parentCommentId, relatedId = replyId
        if (notification.targetId) {
          router.push(
            `/post?commentId=${notification.targetId}&replyId=${notification.relatedId}`,
          );
        }
        break;

      case "FOLLOW":
        // Navigate to actor's profile
        router.push(`/profile/${notification.actor.username}`);
        break;

      default:
        break;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
        !notification.isRead ? "bg-blue-50/50" : ""
      }`}
    >
      {/* Avatar with notification type icon */}
      <div className="relative flex-shrink-0">
        <NotificationAvatar
          src={notification.actor.avatar}
          alt={notification.actor.displayname}
          size={44}
        />
        <div
          className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getIconBgColor(
            notification.type,
          )}`}
        >
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          <span className="font-semibold">
            {notification.actor.displayname}
          </span>{" "}
          <span className="text-gray-600">{notification.message}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {getTimeAgo(notification.createdAt)}
        </p>
      </div>

      {/* Unread indicator & Delete button */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {!notification.isRead && (
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        )}
        <button
          onClick={handleDelete}
          className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          title="Delete notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

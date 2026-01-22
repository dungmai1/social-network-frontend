"use client";
import { useState } from "react";
import { formatDate } from "@/lib/date";
import DeleteDialog from "@/components/comment/DeleteDialog";
import RepliesComments from "@/components/comment/RepliesComments";
import { CommentModel } from "@/types/comment";
import { Heart } from "lucide-react";
import { useCommentInfo } from "@/hooks/useCommentInfo";
import useUser from "@/hooks/useUser";
import { PostModel } from "@/types/post";
import Link from "next/link";

export default function Comment({
  post,
  comment,
  onReply,
  onDelete,
  onEdit,
}: {
  post: PostModel;
  comment: CommentModel;
  onReply: (username: string, commentId: number) => void;
  onDelete: (postId: number, commentId: number) => void;
  onEdit: (
    postId: number,
    commentId: number,
    content: string,
    imageUrl?: string,
  ) => Promise<boolean>;
}) {
  const { isLikeComment, likeCommentCount, handleAddLikeComment } =
    useCommentInfo(comment);
  const { userCurrent } = useUser();
  const canDelete =
    userCurrent?.username === comment.username ||
    userCurrent?.username === post.username;
  const canEdit = userCurrent?.username === comment.username;

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartEdit = () => {
    setEditContent(comment.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (editContent.trim().length === 0) return;
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    const success = await onEdit(
      comment.postId,
      comment.id,
      editContent.trim(),
      comment.imageUrl,
    );
    setIsLoading(false);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  };
  return (
    <div>
      <div className="flex gap-3">
        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
          <Link href={`/profile/${comment.username}`}>
            <img
              src={comment.userAvatar}
              alt="User"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="text-sm flex-1">
              <div>
                <Link href={`/profile/${comment.username}`}>
                  <span className="font-semibold text-gray-900 mr-2">
                    {comment.username}
                  </span>
                </Link>
              </div>
              {isEditing ? (
                <div className="mt-1">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                    autoFocus
                    disabled={isLoading}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isLoading || editContent.trim().length === 0}
                      className="text-xs text-blue-500 font-semibold hover:text-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Press Enter to save • Esc to cancel
                  </p>
                </div>
              ) : (
                <span className="text-gray-700">{comment.content}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div onClick={() => handleAddLikeComment(comment.id)}>
                <button>
                  <Heart
                    size={12}
                    fill={isLikeComment ? "#ef4444" : "none"}
                    stroke={isLikeComment ? "#ef4444" : "#374151"}
                    className="transition-colors"
                  />
                </button>
              </div>
            </div>
          </div>
          {!isEditing && (
            <div className="flex gap-4 mt-1">
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(comment.commentTime)}
              </div>
              {likeCommentCount > 0 && (
                <div className="text-xs text-gray-500 mt-1 font-semibold">
                  {likeCommentCount === 1
                    ? likeCommentCount + " like"
                    : likeCommentCount + " likes"}
                </div>
              )}
              <div
                className="text-xs text-gray-500 mt-1 font-semibold cursor-pointer"
                onClick={() => onReply(comment.username, comment.id)}
              >
                Reply
              </div>
              {(canEdit || canDelete) && !isEditing && (
                <DeleteDialog
                  postId={comment.postId}
                  commentId={comment.id}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onDelete={onDelete}
                  onEditClick={handleStartEdit}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <RepliesComments
        key={comment.id}
        commentId={comment.id}
        onReply={onReply}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  );
}

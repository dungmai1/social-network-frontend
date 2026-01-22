"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { formatDate } from "@/lib/date";
import useReplies from "@/hooks/useReplies";
import { useCommentInfo } from "@/hooks/useCommentInfo";
import DeleteDialog from "@/components/comment/DeleteDialog";
import { CommentModel } from "@/types/comment";
import useUser from "@/hooks/useUser";

function ReplyItem({
  reply,
  onReply,
  onDelete,
  onEdit,
}: {
  reply: CommentModel;
  onReply: (userName: string, commentId: number) => void;
  onDelete: (postId: number, commentId: number) => void;
  onEdit: (
    postId: number,
    commentId: number,
    content: string,
    imageUrl?: string,
  ) => Promise<boolean>;
}) {
  const { isLikeComment, likeCommentCount, handleAddLikeComment } =
    useCommentInfo(reply);
  const { userCurrent } = useUser();
  const canEdit = userCurrent?.username === reply.username;
  const canDelete = userCurrent?.username === reply.username;

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartEdit = () => {
    setEditContent(reply.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditContent(reply.content);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (editContent.trim().length === 0) return;
    if (editContent.trim() === reply.content) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    const success = await onEdit(
      reply.postId,
      reply.id,
      editContent.trim(),
      reply.imageUrl,
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
    <div key={reply.id}>
      <div className="flex gap-3">
        <div className="w-6 h-6" />
        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
          <img
            src={reply.userAvatar}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="text-sm flex-1">
              <span className="font-semibold text-gray-900 mr-2">
                {reply.username}
              </span>
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
                <span className="text-gray-700">{reply.content}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div onClick={() => handleAddLikeComment(reply.id)}>
                <button>
                  <Heart
                    fill={isLikeComment ? "#ef4444" : "none"}
                    stroke={isLikeComment ? "#ef4444" : "#374151"}
                    size={12}
                    className="transition-colors"
                  />
                </button>
              </div>
            </div>
          </div>
          {!isEditing && (
            <div className="flex gap-5">
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(reply.commentTime)}
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
                onClick={() => onReply(reply.username, reply.id)}
              >
                Reply
              </div>
              {(canEdit || canDelete) && !isEditing && (
                <DeleteDialog
                  postId={reply.postId}
                  commentId={reply.id}
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
    </div>
  );
}

export default function RepliesComments({
  commentId,
  onReply,
  onDelete,
  onEdit,
}: {
  commentId: number;
  onReply: (userName: string, commentId: number) => void;
  onDelete: (postId: number, commentId: number) => void;
  onEdit: (
    postId: number,
    commentId: number,
    content: string,
    imageUrl?: string,
  ) => Promise<boolean>;
}) {
  const {
    repliesCount,
    replies,
    showReply,
    handleGetAllRepliesComment,
    handleDeleteReply,
    handleEditReply,
  } = useReplies(commentId);

  const handleDelete = (postId: number, replyId: number) => {
    onDelete(postId, replyId);
    handleDeleteReply(replyId);
  };

  const handleEdit = async (
    postId: number,
    replyId: number,
    content: string,
    imageUrl?: string,
  ): Promise<boolean> => {
    const success = await onEdit(postId, replyId, content, imageUrl);
    if (success) {
      handleEditReply(replyId, content, imageUrl);
    }
    return success;
  };

  const handleReply = (userName: string) => {
    onReply(userName, commentId);
  };

  return (
    <>
      {repliesCount > 0 && (
        <div className="mt-2">
          <div className="flex gap-3">
            <div className="w-6 h-6" />
            <div className="flex gap-2 text-xs text-gray-500 font-semibold">
              <hr className="w-10 border-t-2 border-gray-400 my-2" />
              <span
                onClick={() => handleGetAllRepliesComment(commentId)}
                className="cursor-pointer"
              >
                {showReply ? "Hide Replies" : `View Replies (${repliesCount})`}
              </span>
            </div>
          </div>
          {showReply && (
            <div className="space-y-3 mb-3">
              {replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  onReply={handleReply}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

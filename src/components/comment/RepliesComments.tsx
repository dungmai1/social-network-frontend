import { Heart } from "lucide-react";
import { formatDate } from "@/lib/date";
import useReplies from "@/hooks/useReplies";
import { useCommentInfo } from "@/hooks/useCommentInfo";
import DeleteDialog from "@/components/comment/DeleteDialog";
import { CommentModel } from "@/types/comment";

function ReplyItem({
  reply,
  onReply,
  onDelete,
}: {
  reply: CommentModel;
  onReply: (userName: string, commentId: number) => void;
  onDelete: (postId: number, commentId: number) => void;
}) {
  const { isLikeComment, likeCommentCount, handleAddLikeComment } =
    useCommentInfo(reply);

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
            <div className="text-sm">
              <span className="font-semibold text-gray-900 mr-2">
                {reply.username}
              </span>
              <span className="text-gray-700">{reply.content}</span>
            </div>
            <div
              className="flex items-center"
              onClick={() => handleAddLikeComment(reply.id)}
            >
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
            <DeleteDialog
              postId={reply.postId}
              commentId={reply.id}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RepliesComments({
  commentId,
  onReply,
  onDelete,
}: {
  commentId: number;
  onReply: (userName: string, commentId: number) => void;
  onDelete: (postId: number, commentId: number) => void;
}) {
  const {
    repliesCount,
    replies,
    showReply,
    handleGetAllRepliesComment,
    handleDeleteReply,
  } = useReplies(commentId);

  const handleDelete = (postId: number, replyId: number) => {
    onDelete(postId, replyId);
    handleDeleteReply(replyId);
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
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

import { formatDate } from "@/lib/date";
import DeleteDialog from "@/components/comment/DeleteDialog";
import RepliesComments from "./RepliesComments";
import { CommentModel } from "@/types/comment";
import { Heart } from "lucide-react";
import { useCommentInfo } from "@/hooks/useCommentInfo";
import useUser from "@/hooks/useUser";
import { PostModel } from "@/types/post";
import useReplies from "@/hooks/useReplies";
import Link from "next/link";

export default function Comment({ post, comment, onReply, onDelete }: { post: PostModel, comment: CommentModel, onReply: (username: string, commentId: number) => void, onDelete: (postId: number, commentId: number) => void }) {
    const { isLikeComment, likeCommentCount, handleAddLikeComment } = useCommentInfo(comment);
    const { userCurrent } = useUser();
    const canDelete = userCurrent?.username === comment.username || userCurrent?.username === post.username;
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
                        <div className="text-sm">
                            <div>
                                <Link href={`/profile/${comment.username}`}>
                                    <span className="font-semibold text-gray-900 mr-2">
                                        {comment.username}
                                    </span>
                                </Link>
                            </div>
                            <span className="text-gray-700">
                                {comment.content}
                            </span>
                        </div>
                        <div
                            className="flex items-center"
                            onClick={() => handleAddLikeComment(comment.id)}
                        >
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
                    <div className="flex gap-4 mt-1">
                        <div className="text-xs text-gray-500 mt-1">
                            {formatDate(comment.commentTime)}
                        </div>
                        {likeCommentCount > 0 && (
                            <div
                                className="text-xs text-gray-500 mt-1 font-semibold"
                            >
                                {likeCommentCount === 1 ? likeCommentCount + " like" : likeCommentCount + " likes"}
                            </div>
                        )}

                        <div
                            className="text-xs text-gray-500 mt-1 font-semibold cursor-pointer"
                            onClick={() =>
                                onReply(comment.username, comment.id)
                            }
                        >
                            Reply
                        </div>
                        {canDelete && (
                            <DeleteDialog postId={comment.postId}
                                commentId={comment.id}
                                onDelete={onDelete}
                            />
                        )}

                    </div>
                </div>
            </div>
            <RepliesComments
                key={comment.id}
                commentId={comment.id}
                onReply={onReply}
                onDelete={onDelete}
            />
        </div>
    )
}
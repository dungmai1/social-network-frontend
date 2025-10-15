import { formatDate } from "@/lib/date";
import DeleteDialog from "@/components/comment/DeleteDialog";
import RepliesComments from "./RepliesComments";
import { CommentModel } from "@/types/comment";
import { Heart } from "lucide-react";

export default function Comment({ comment, onReply }: { comment: CommentModel, onReply: (username: string) => void }) {
    return (
        <div>
            <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                        src="https://picsum.photos/seed/user1/40"
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div className="text-sm">
                            <span className="font-semibold text-gray-900 mr-2">
                                {comment.userDisplayname}
                            </span>
                            <span className="text-gray-700">
                                {comment.content}
                            </span>
                        </div>
                        <div
                            className="flex items-center"
                        // onClick={() => handleAddLikeComment(comment.id)}
                        >
                            <button>
                                <Heart
                                    size={12}
                                    //   fill={isLiked[comment.id] ? "#ef4444" : "none"}
                                    //   stroke={isLiked[comment.id] ? "#ef4444" : "#374151"}
                                    className="transition-colors"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-xs text-gray-500 mt-1">
                            {formatDate(comment.commentTime)}
                        </div>
                        <div
                            className="text-xs text-gray-500 mt-1 font-semibold cursor-pointer"
                            onClick={() =>
                                onReply(comment.userDisplayname)
                            }
                        >
                            Reply
                        </div>
                        <DeleteDialog postId={comment.postId}
                            commentId={comment.id} />
                    </div>
                </div>
            </div>
            <RepliesComments
                commentId={comment.id}
                onReply={onReply}
            />
        </div>
    )
}
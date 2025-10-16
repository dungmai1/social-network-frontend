import { Heart } from "lucide-react";
import { formatDate } from "../../../lib/date";
import useReplies from "@/hooks/useReplies";
import DeleteDialog from "@/components/comment/DeleteDialog";

export default function RepliesComments({ commentId, onReply, onDelete }: { commentId: number, onReply: (userName: string, commentId: number) => void; onDelete: (postId: number, commentId: number) => void }) {
    const { repliesCount, replies, showReply, handleGetAllRepliesComment } = useReplies(commentId);
    return (
        <>
            {repliesCount > 0 && (
                <div className="mt-2">
                    <div className="flex gap-3">
                        <div className="w-6 h-6" />
                        <div className="flex gap-2 text-xs text-gray-500 font-semibold">
                            <hr className="w-10 border-t-2 border-gray-400 my-2" />
                            <span onClick={() => handleGetAllRepliesComment(commentId)} className="cursor-pointer">
                                {showReply ? "Hide Replies" : `View Replies (${repliesCount})`}
                            </span>
                        </div>
                    </div>
                    {showReply && (
                        <div className="space-y-3 mb-3">
                            {/* Sample comment for UI preview - replace with your data */}
                            {replies.map((replies) => (
                                <div key={replies.id}>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6" />
                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                                            <img
                                                src={replies.userAvatar}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <div className="text-sm">
                                                    <span className="font-semibold text-gray-900 mr-2">
                                                        {replies.userDisplayname}
                                                    </span>
                                                    <span className="text-gray-700">{replies.content}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <button>
                                                        <Heart
                                                            size={12}
                                                            className="transition-colors"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex gap-5">
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatDate(replies.commentTime)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 font-semibold cursor-pointer" onClick={() => onReply(replies.userDisplayname, commentId)}>
                                                    Reply
                                                </div>
                                                {/* {canDelete && ( */}
                                                <DeleteDialog postId={replies.postId} commentId={replies.id} onDelete={onDelete} />
                                                {/* )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
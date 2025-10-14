import { useEffect, useState } from "react";
import { getAllRepliesComments, getCountRepliesComments } from "../services/comment.service";
import { CommentModel } from "../types/comment";
import { Heart } from "lucide-react";
import { formatDate } from "../(libs)/date";

export default function RepliesComments({ commentId, onReply }: { commentId: number, onReply: (userName: string) => void; }) {
    const [repliesCount, setRepliesCount] = useState(0);
    const [replies, setReplies] = useState<{ [key: number]: CommentModel[] }>({});
    const [showReply, setShowReply] = useState<boolean>(false);
    const [commentInput, setCommentInput] = useState("");
    const handleGetCountRepliesComment = async (commentId: number) => {
        const res = await getCountRepliesComments(commentId);
        setRepliesCount(res);
    }
    const handleGetAllRepliesComment = async (commentId: number) => {
        const res = await getAllRepliesComments(commentId);
        setReplies((prev) => ({
            ...prev,
            [commentId]: res
        }
        ))
        setShowReply(!showReply);
    }
    const handleClickReply = (userNameReply: String) => {
        setCommentInput(`@${userNameReply} `);
    }
    useEffect(() => {
        handleGetCountRepliesComment(commentId)
    }, [])
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
                    {replies[commentId] && showReply && (
                        <div className="space-y-3 mb-3">
                            {/* Sample comment for UI preview - replace with your data */}
                            {replies[commentId].map((replies) => (
                                <div>
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
                                                    <Heart
                                                        size={12}
                                                        className="transition-colors"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-5">
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatDate(replies.commentTime)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 font-semibold cursor-pointer" onClick={() => onReply(replies.userDisplayname)}>
                                                    Reply
                                                </div>
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
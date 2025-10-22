import { getAllRepliesComments, getCountRepliesComments } from "@/services/comment.service";
import { CommentModel } from "@/types/comment";
import { useCallback, useEffect, useState } from "react";
import { registerRepliesAppender, unregisterRepliesAppender } from "@/hooks/repliesRegistry";
import { addLike } from "@/services/like.service";

export default function useReplies(commentId: number) {
    const [repliesCount, setRepliesCount] = useState(0);
    const [replies, setReplies] = useState<CommentModel[]>([]);
    const [showReply, setShowReply] = useState<boolean>(false);
    const [isLikeComment, setIsLikeComment] = useState(false);
    const [likeCommentCount, setLikeCommentCount] = useState(0);
    const handleGetCountRepliesComment = async (commentId: number) => {
        try {
            const res = await getCountRepliesComments(commentId);
            setRepliesCount(res);
        } catch (error) {
            console.log("Error count replies comment", error);
        }
    }
    const handleGetAllRepliesComment = async (commentId: number) => {
        try {
            const res = await getAllRepliesComments(commentId);
            setReplies(res);
            setShowReply(!showReply);
        } catch (error) {
            console.log("Error fetch replies comment", error);
        }
    }
    const handleAddLikeComment = async (commentId: number) => {
        try {
            const res = await addLike("commentId", commentId, "comment");
            if (res) {
                setIsLikeComment((p) => !p);
                setLikeCommentCount((c) => c + (isLikeComment ? -1 : 1));
            }
        } catch (error) {
            console.error("Error like comment:", error);
        }
    }
    const appendReply = useCallback((reply: CommentModel) => {
        setReplies((prev) => [...prev, reply]);
        setRepliesCount((c) => c + 1);
    }, []);
    useEffect(() => {
        handleGetCountRepliesComment(commentId)
    }, [commentId])
    useEffect(() => {
        registerRepliesAppender(commentId, appendReply);
        return () => {
            unregisterRepliesAppender(commentId);
        };
    }, [commentId, appendReply]);
    return { repliesCount, replies, showReply, isLikeComment,likeCommentCount,  appendReply, handleGetAllRepliesComment,handleAddLikeComment }
}
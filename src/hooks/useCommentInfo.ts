import { addLike, getCommentLikeInfo } from "@/services/like.service";
import { CommentModel } from "@/types/comment";
import { useEffect, useState } from "react";

export function useCommentInfo(comment: CommentModel) {
    const [isLikeComment, setIsLikeComment] = useState(false);
    const [likeCommentCount, setLikeCommentCount] = useState(0);
    const handleGetCommentLikeInfo = async () => {
        try {
            const res = await getCommentLikeInfo(comment.id);
            if (!res) return;
            setIsLikeComment(res.liked);
            setLikeCommentCount(res.likeCount ?? 0);
        } catch (error) {
            console.error("Error get comment like info: ", error)
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
    useEffect(() => {
        handleGetCommentLikeInfo();
    }, [comment.id])
    return { isLikeComment, likeCommentCount, handleGetCommentLikeInfo, handleAddLikeComment }
}



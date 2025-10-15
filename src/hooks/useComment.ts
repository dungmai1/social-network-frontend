import { addComment, deleteComment, getAllComment, getCountComments } from "@/services/comment.service";
import { CommentModel } from "@/types/comment";
import { PostModel } from "@/types/post";
import { useEffect, useState } from "react";

export function useComment(post: PostModel) {
    const [commentInput, setCommentInput] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<CommentModel[]>([]);
    const [commentCount, setCommentCount] = useState(0);
    const handleShowComment = () => {
        const postId = post.id;
        setShowComments((p) => !p)
        if (!showComments && comments.length === 0) {
            handleGetComments(postId);
        }
    };
    const handleGetComments = async (postId: number) => {
        const res = await getAllComment(postId);
        setComments(res ?? []);
    };
    const handleCountComment = async () => {
        try {
            const res = await getCountComments(post.id);
            setCommentCount(res ?? 0);
        } catch {
            console.log("Error count comment")
        }
    };
    const handleClickReply = (userNameReply: string) => {
        setCommentInput(`@${userNameReply} `);
    };
    const handleAddComment = async (postId: number, content: string) => {
        try {
            const commentRequest = { postId, contentCmt: content };
            const res = await addComment(commentRequest);
            if (!res) return;
            const newComments = Array.isArray(res) ? res : [res];
            setComments((p) => [...p, ...newComments]);
            setCommentInput("");
            setCommentCount((p) => p + 1);
        } catch (error) {
            console.log("Error add comment");
        }
    };
    const handleDeleteComment = async (postId: number, commentId: number) => {
        try {
            const res = await deleteComment(postId, commentId);
            if (!res) return;
            setCommentInput("");
            setCommentCount((p) => (p > 0 ? p - 1 : 0));
            setComments((p) => p.filter((c) => c.id !== commentId));
        } catch (error) {
            console.log("Erorr delete comment: ", error)
        }
    }
    useEffect(() => {
        handleCountComment();
    }, []);
    return { showComments, comments, commentCount, commentInput, handleShowComment, handleClickReply, handleAddComment, handleDeleteComment, setCommentInput }
}
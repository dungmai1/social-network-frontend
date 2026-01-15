import {
  addComment,
  addReplies,
  deleteComment,
  getAllComment,
  getCountComments,
  getCountRepliesComments,
} from "@/services/comment.service";
import { getCommentLikeInfo } from "@/services/like.service";
import { CommentModel } from "@/types/comment";
import { PostModel } from "@/types/post";
import { useEffect, useState } from "react";
import { appendReplyById } from "@/hooks/repliesRegistry";

export function useComment(post: PostModel) {
  const [commentInput, setCommentInput] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [replyTo, setReplyTo] = useState<number>();
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const handleShowComment = () => {
    const postId = post.id;
    setShowComments((p) => !p);
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
      console.log("Error count comment");
    }
  };
  const handleClickReply = (userNameReply: string, commentId: number) => {
    setCommentInput(`@${userNameReply} `);
    setReplyTo(commentId);
  };
  const handleAddComment = async (postId: number) => {
    try {
      if (commentInput.trim().length === 0) return;
      let resp;
      if (replyTo) {
        resp = await addReplies({
          commentId: replyTo,
          content: commentInput.trim(),
        });
        if (!resp) return;
        const newReply = Array.isArray(resp) ? resp[0] : resp;
        appendReplyById(replyTo, newReply);
        setReplyTo(undefined);
      } else {
        const commentRequest = { postId, contentCmt: commentInput };
        resp = await addComment(commentRequest);
        if (!resp) return;
        const newComments = Array.isArray(resp) ? resp : [resp];
        setComments((p) => [...p, ...newComments]);
      }
      setCommentInput("");
      setCommentCount((p) => p + 1);
    } catch (error) {
      console.log("Error add comment");
    }
  };
  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      const repliesCount = await getCountRepliesComments(commentId);

      const res = await deleteComment(postId, commentId);
      if (!res) return;
      setCommentInput("");
      const totalToDelete = 1 + (repliesCount ?? 0);
      setCommentCount((p) => (p >= totalToDelete ? p - totalToDelete : 0));
      setComments((p) => p.filter((c) => c.id !== commentId));
      setReplyTo(undefined);
    } catch (error) {
      console.log("Erorr delete comment: ", error);
    }
  };
  useEffect(() => {
    handleCountComment();
  }, []);
  return {
    showComments,
    comments,
    commentCount,
    commentInput,
    replyTo,
    handleShowComment,
    handleClickReply,
    handleAddComment,
    handleDeleteComment,
    setCommentInput,
  };
}

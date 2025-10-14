"use client";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { PostModel } from "../types/post";
import { CommentModel } from "../types/comment";
import { formatDate } from "../(libs)/date";
import { addLike, getLikePost } from "../services/like.service";
import { addComment, addReplies, getAllComment, getCountComments, getCountRepliesComments } from "../services/comment.service";
import RepliesComments from "./RepliesComment";

export default function Post({ post }: { post: PostModel }) {
  const [openCommentMenuId, setOpenCommentMenuId] = useState<boolean>();
  const [isLiked, setIsLiked] = useState<{ [key: number]: boolean }>({});
  const [commentInput, setCommentInput] = useState("");
  const [likeCount, setLikeCount] = useState<{ [key: number]: number }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [comments, setComments] = useState<{ [key: number]: CommentModel[] }>(
    {}
  );
  const [commentCount, setCommentCount] = useState<{ [key: number]: number }>({});

  const handleLikeToggle = async () => {
    try {
      const res = await getLikePost(post.id);
      if (!res) return;
      setLikeCount((prev) => ({
        ...prev,
        [post.id]: res.likeCount,
      }));
      setIsLiked((prev) => ({
        ...prev,
        [post.id]: res.liked,
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  const handleShowComment = () => {
    const postId = post.id;
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    handleGetComments(postId);
  };
  const handleGetComments = async (postId: number) => {
    const res = await getAllComment(postId);
    setComments((prev) => ({
      ...prev,
      [postId]: res ?? [],
    }));
  };
  const handleCountComment = async () => {
    const res = await getCountComments(post.id);
    setCommentCount((prev) => ({
      ...prev,
      [post.id]: res
    }));
  };
  const handleClickLike = async (postId: number) => {
    try {
      const res = await addLike("postId", postId, "post");
      if (res) {
        setIsLiked((prev) => ({
          ...prev,
          [postId]: !prev[postId],
        }));
        setLikeCount((prev) => ({
          ...prev,
          [postId]: prev[postId] + (isLiked[postId] ? -1 : 1),
        }));
      }
    } catch (error) {
      console.log("Error click like");
    }
  };
  const handleClickReply = (userNameReply: String) => {
    setCommentInput(`@${userNameReply} `);
  }
  const handleAddLikeComment = async (commentId: number) => {
    try {

      const res = await addLike("commentId", commentId, "comment")
      if (res.ok) {
        setIsLiked((prev) => ({
          ...prev,
          [commentId]: !prev[commentId],
        }));
      }
    } catch (error) {
      console.log("Error add like comment")
    }
  }
  const handleAddComment = async (postId: number, content: string) => {
    try {
      const commentRequest = { postId, contentCmt: content };
      const res = await addComment(commentRequest);
      if (!res) return;
      const newComments = Array.isArray(res) ? res : [res];
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), ...newComments],
      }));
      setCommentInput("");
      setCommentCount((prev) => ({
        ...prev,
        [postId]: prev[postId] + 1
      }))
    } catch (error) {
      console.log("Error add comment");
    }
  };
  const handleOpenCommentMenuId = () => {
    setOpenCommentMenuId(!openCommentMenuId);
  }
  useEffect(() => {
    handleLikeToggle();
    handleCountComment();
  }, []);
  return (
    <div className="space-y-6">
      <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <img
              src={post.avatar}
              alt={post.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900">
              {post.displayName}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(post.postTime)}
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100 transition" title="More options" aria-label="More options">
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Image */}
        <div className="w-full h-96 bg-gray-100">
          <img
            src={`https://picsum.photos/seed/post-${post.id}/1200/900`}
            alt="post"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Actions */}
        <div className="p-2">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => { handleClickLike(post.id) }}
              className="p-1 rounded-lg hover:bg-gray-100 transition"
            >
              <Heart
                size={22}
                fill={isLiked[post.id] ? "#ef4444" : "none"}
                stroke={isLiked[post.id] ? "#ef4444" : "#374151"}
                className="transition-colors"
              />
            </button>
            <button className="p-1 rounded-lg hover:bg-gray-100 transition">
              <MessageCircle size={22} className="text-gray-700" />
            </button>
            <button className="p-1 rounded-lg hover:bg-gray-100 transition">
              <Send size={22} className="text-gray-700" />
            </button>
          </div>

          {/* Likes */}
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {likeCount[post.id]} likes
          </div>

          {/* Caption */}
          <div className="text-sm mb-2">
            <span className="font-semibold text-gray-900 mr-2">
              {post.displayName}
            </span>
            <span className="text-gray-700">
              {post.content ||
                "This is a sample caption showing how the post will look."}
            </span>
          </div>

          {/* Comments */}
          <div
            className="text-xs text-gray-500 mb-3 cursor-pointer hover:text-gray-700 transition"
            onClick={() => handleShowComment()}
          >
            {showComments[post.id]
              ? "Hide comments"
              : commentCount[post.id] == 0 ? "" : `View all ${commentCount[post.id]} comments`}
          </div>

          {showComments[post.id] && comments[post.id] && (
            <div className="space-y-3 mb-3">
              {/* Sample comment for UI preview - replace with your data */}
              {comments[post.id].map((comment) => (
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
                          <span className="text-gray-700">{comment.content}</span>
                        </div>
                        <div className="flex items-center" onClick={() => handleAddLikeComment(comment.id)}>
                          <Heart
                            size={12}
                            fill={isLiked[comment.id] ? "#ef4444" : "none"}
                            stroke={isLiked[comment.id] ? "#ef4444" : "#374151"}
                            className="transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex gap-5">
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(comment.commentTime)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-semibold cursor-pointer" onClick={() => handleClickReply(comment.userDisplayname)}>
                          Reply
                        </div>
                        <button onClick={() => { handleOpenCommentMenuId }} className="p-1 rounded-full hover:bg-gray-100 transition" title="More options" aria-label="More options">
                          <MoreHorizontal size={18} className="text-gray-400" />
                        </button>
                        {/* {openCommentMenuId && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-xl shadow-lg z-10">
                            <button
                              onClick={() => {
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                            >
                              Xóa bình luận
                            </button>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                  <RepliesComments commentId={comment.id} onReply={handleClickReply} />
                </div>
              ))}
            </div>
          )}
          {/* Add Comment */}
          <div className="border-t border-gray-100 pt-3">
            <form className="flex items-center gap-3" onSubmit={(e) => { e.preventDefault(); handleAddComment(post.id, commentInput); }}>
              <input
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-500"
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button type="submit" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                Post
              </button>
            </form>
          </div>
        </div>
      </article>
    </div>
  );
}

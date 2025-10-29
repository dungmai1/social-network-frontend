"use client";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { PostModel } from "../../../types/post";
import { formatDate } from "../../../lib/date";
import Comment from "./Comment";
import { useLike } from "@/hooks/useLike";
import { useComment } from "@/hooks/useComment";
import Link from "next/link";

export default function Post({ post }: { post: PostModel }) {
  const { isLiked, likeCount, handleClickLike } = useLike(post);
  const {
    showComments,
    comments,
    commentCount,
    commentInput,
    handleShowComment,
    handleClickReply,
    handleAddComment,
    handleDeleteComment,
    setCommentInput,
  } = useComment(post);
  return (
    <div>
      <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <Link href={`/profile/${post.username}`}>
              <img
                src={post.avatar}
                alt={post.username}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
          <div className="flex-1">
            <Link href={`/profile/${post.username}`}>
              <div className="text-sm font-semibold text-gray-900">
                {post.username}
              </div>
            </Link>
            <div className="text-xs text-gray-500">
              {formatDate(post.postTime)}
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100 transition">
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-square bg-gray-100">
        <img
            src={post.imageUrl}
            alt="post"
            className="absolute top-0 left-0 w-full h-full object-cover"
            />
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => {
                handleClickLike(post.id);
              }}
              className="p-1 rounded-lg hover:bg-gray-100 transition"
            >
              <Heart
                size={22}
                fill={isLiked ? "#ef4444" : "none"}
                stroke={isLiked ? "#ef4444" : "#374151"}
                className="transition-colors"
              />
            </button>
            <button
              className="p-1 rounded-lg hover:bg-gray-100 transition"
              onClick={() => handleShowComment()}
            >
              <MessageCircle size={22} className="text-gray-700" />
            </button>
            <button className="p-1 rounded-lg hover:bg-gray-100 transition">
              <Send size={22} className="text-gray-700" />
            </button>
          </div>

          {/* Likes */}
          <div className="text-sm font-semibold text-gray-900 mb-2">
            {likeCount === 0 || likeCount === 1
              ? likeCount + " like"
              : likeCount + " likes"}
          </div>

          {/* Caption */}
          <div className="text-sm mb-2">
            <Link href={`/profile/${post.username}`}>
              <span className="font-semibold text-gray-900 mr-2">
                {post.username}
              </span>
            </Link>
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
            {showComments
              ? "Hide comments"
              : commentCount == 0
                ? ""
                : `View all ${commentCount} comments`}
          </div>

          {showComments && comments && (
            <div className="space-y-3 mb-3">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  post={post}
                  comment={comment}
                  onReply={handleClickReply}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}
          {/* Add Comment */}
          <div className="border-t border-gray-100 pt-3">
            <form
              className="flex items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddComment(post.id);
              }}
            >
              <input
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-500"
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button
                type="submit"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </article>
    </div>
  );
}

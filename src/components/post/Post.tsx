"use client";
import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Send, MoreHorizontal, X } from "lucide-react";
import { PostModel } from "@/types/post";
import { formatDate } from "@/lib/date";
import Comment from "@/components/comment/Comment";
import { useLike } from "@/hooks/useLike";
import { useComment } from "@/hooks/useComment";
import { deletePost, updatePost } from "@/services/post.service";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import useUser from "@/hooks/useUser";

export default function Post({
  post,
  onSavePost,
  onUpdatePost,
  onDeletePost,
}: {
  post: PostModel;
  onSavePost?: (postId: number) => Promise<void> | void;
  onUpdatePost?: (updatedPost: PostModel) => void;
  onDeletePost?: (postId: number) => void;
}) {
  const { userCurrent } = useUser();
  const hasMultiple = post.images.length > 1;
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
    handleEditComment,
    setCommentInput,
  } = useComment(post);
  const [showOptions, setShowOptions] = useState(false);
  const [saved, setSaved] = useState(post.saved);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<PostModel>(post);
  const [isDeleted, setIsDeleted] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isOwner = userCurrent?.username === post.username;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  useEffect(() => {
    setCurrentPost(post);
    setEditedContent(post.content);
  }, [post]);

  const handleAddFavorite = async () => {
    if (!onSavePost) return;
    try {
      await Promise.resolve(onSavePost(post.id));
      setSaved((prev) => !prev);
    } catch (error) {
      console.error("Failed to save/unsave post", error);
    } finally {
      setShowOptions(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowOptions(false);
    setError(null);
  };
  const handleDeleteClick = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await deletePost(post.id);
      setIsDeleted(true);
      setShowOptions(false);
      // Call callback after UI update
      setTimeout(() => {
        onDeletePost?.(post.id);
      }, 300);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to delete post";
      setError(errorMsg);
      console.error("Failed to delete post", error);
      setIsLoading(false);
    }
  };
  const handleSaveEdit = async () => {
    if (!editedContent.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await updatePost(post.id, editedContent);
      const updatedPost: PostModel = {
        ...currentPost,
        content: editedContent.trim(),
      };

      setCurrentPost(updatedPost);
      setEditedContent(updatedPost.content);
      onUpdatePost?.(updatedPost);
      setIsEditing(false);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to update post";
      setError(errorMsg);
      console.error("Failed to update post", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(currentPost.content);
    setError(null);
  };
  return (
    <div>
      {isDeleted && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm p-4 text-center text-gray-500">
          Post deleted successfully
        </div>
      )}

      {!isDeleted && (
        <>
          <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 relative">
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
                <div className="text-sm font-semibold text-gray-900">
                  <Link href={`/profile/${post.username}`}>
                    <span>{post.username}</span>
                  </Link>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(post.postTime)}
                </div>
              </div>
              <button
                className="p-1 rounded-full hover:bg-gray-100 transition"
                onClick={() => setShowOptions((prev) => !prev)}
              >
                <MoreHorizontal size={20} className="text-gray-600" />
              </button>
              {showOptions && (
                <div
                  ref={menuRef}
                  className="absolute top-12 right-4 w-60 rounded-2xl bg-[#1d1d1d] text-white shadow-2xl border border-gray-700 overflow-hidden z-20"
                >
                  <div className="divide-y divide-gray-800">
                    <button
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-200 hover:bg-[#2c2c2c] transition disabled:opacity-50"
                      onClick={() => handleAddFavorite()}
                      disabled={isLoading}
                    >
                      {saved ? "Saved" : "Add to favorites"}
                    </button>
                    {isOwner && (
                      <>
                        <button
                          className="w-full text-left px-4 py-3 text-sm font-medium text-gray-200 hover:bg-[#2c2c2c] transition disabled:opacity-50"
                          onClick={handleEditClick}
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-[#2c2c2c] transition disabled:opacity-50"
                          onClick={handleDeleteClick}
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    <button
                      className="w-full text-left px-4 py-3 text-sm font-medium text-gray-200 hover:bg-[#2c2c2c] transition"
                      onClick={() => setShowOptions(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Image */}
            <div className="relative w-full aspect-square bg-gray-100">
              {post.images &&
              Array.isArray(post.images) &&
              post.images.length > 0 ? (
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {post.images.map((img, i) => (
                      <CarouselItem
                        key={i}
                        className="flex items-center justify-center"
                      >
                        <img
                          src={img}
                          alt={`post-img-${i}`}
                          className="w-full h-full object-contain rounded"
                          style={{ maxHeight: "400px", maxWidth: "100%" }}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {hasMultiple && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              ) : (
                <span className="text-gray-400">No image</span>
              )}
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
                <Link href={`/profile/${currentPost.username}`}>
                  <span className="font-semibold text-gray-900 mr-2">
                    {currentPost.username}
                  </span>
                </Link>
                {isEditing ? (
                  <div className="mt-2">
                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
                        {error}
                      </div>
                    )}
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveEdit();
                        }
                        if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      autoFocus
                      disabled={isLoading}
                      placeholder="What's on your mind?"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isLoading || !editedContent.trim()}
                        className="text-xs text-blue-500 font-semibold hover:text-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Press Enter to save • Esc to cancel
                    </p>
                  </div>
                ) : (
                  <span className="text-gray-700">
                    {currentPost.content || ""}
                  </span>
                )}
              </div>

              {/* Comments */}
              <div
                className="text-xs text-gray-500 mb-3 cursor-pointer hover:text-gray-700 transition"
                onClick={() => handleShowComment()}
              >
                {commentCount == 0
                  ? ""
                  : showComments
                    ? "Hide comments"
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
                      onEdit={handleEditComment}
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
        </>
      )}
    </div>
  );
}

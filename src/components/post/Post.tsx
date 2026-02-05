"use client";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  X,
  Edit3,
  Trash2,
  Flag,
} from "lucide-react";
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
        "Are you sure you want to delete this post? This action cannot be undone."
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
        <div className="glass-card rounded-2xl overflow-hidden p-6 text-center">
          <p className="text-muted-foreground">Post deleted successfully</p>
        </div>
      )}

      {!isDeleted && (
        <article className="glass-card rounded-2xl overflow-hidden hover-lift">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 relative">
            <Link href={`/profile/${post.username}`}>
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                <img
                  src={post.avatar}
                  alt={post.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/profile/${post.username}`}>
                <p className="text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                  {post.username}
                </p>
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.postTime)}
              </p>
            </div>
            <button
              className="p-2 rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={() => setShowOptions((prev) => !prev)}
            >
              <MoreHorizontal size={20} />
            </button>

            {/* Options Menu */}
            {showOptions && (
              <div
                ref={menuRef}
                className="absolute top-14 right-4 w-52 glass-card rounded-xl shadow-xl overflow-hidden z-20"
              >
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent/50 transition-colors cursor-pointer disabled:opacity-50"
                  onClick={() => handleAddFavorite()}
                  disabled={isLoading}
                >
                  <Bookmark
                    size={16}
                    className={saved ? "fill-primary text-primary" : ""}
                  />
                  {saved ? "Saved" : "Save post"}
                </button>
                {isOwner && (
                  <>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent/50 transition-colors cursor-pointer disabled:opacity-50"
                      onClick={handleEditClick}
                      disabled={isLoading}
                    >
                      <Edit3 size={16} />
                      Edit post
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
                      onClick={handleDeleteClick}
                      disabled={isLoading}
                    >
                      <Trash2 size={16} />
                      Delete post
                    </button>
                  </>
                )}
                {!isOwner && (
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
                    <Flag size={16} />
                    Report post
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Image Carousel */}
          <div className="relative w-full aspect-square bg-muted/30">
            {post.images && Array.isArray(post.images) && post.images.length > 0 ? (
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
                        className="w-full h-full object-contain"
                        style={{ maxHeight: "500px", maxWidth: "100%" }}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {hasMultiple && (
                  <>
                    <CarouselPrevious className="left-3 bg-card/80 hover:bg-card border-border" />
                    <CarouselNext className="right-3 bg-card/80 hover:bg-card border-border" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleClickLike(post.id)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isLiked
                      ? "text-red-500 bg-red-500/10"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <Heart
                    size={22}
                    fill={isLiked ? "currentColor" : "none"}
                    className={isLiked ? "animate-pulse" : ""}
                  />
                </button>
                <button
                  className="p-2 rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  onClick={() => handleShowComment()}
                >
                  <MessageCircle size={22} />
                </button>
                <button className="p-2 rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <Send size={22} />
                </button>
              </div>
              <button
                onClick={() => handleAddFavorite()}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  saved
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <Bookmark size={22} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Likes */}
            <p className="text-sm font-semibold text-foreground mb-2">
              {likeCount === 0 || likeCount === 1
                ? likeCount + " like"
                : likeCount.toLocaleString() + " likes"}
            </p>

            {/* Caption */}
            <div className="text-sm mb-3">
              <Link href={`/profile/${currentPost.username}`}>
                <span className="font-semibold text-foreground hover:text-primary transition-colors mr-2 cursor-pointer">
                  {currentPost.username}
                </span>
              </Link>
              {isEditing ? (
                <div className="mt-2">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-3 py-2 rounded-lg mb-2 text-sm">
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
                    className="w-full px-4 py-3 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-foreground placeholder:text-muted-foreground"
                    rows={3}
                    autoFocus
                    disabled={isLoading}
                    placeholder="What's on your mind?"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      Press Enter to save · Esc to cancel
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isLoading || !editedContent.trim()}
                        className="px-4 py-1.5 text-xs bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-foreground/80">{currentPost.content || ""}</span>
              )}
            </div>

            {/* Comments Toggle */}
            {commentCount > 0 && (
              <button
                className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 cursor-pointer"
                onClick={() => handleShowComment()}
              >
                {showComments
                  ? "Hide comments"
                  : `View all ${commentCount} comments`}
              </button>
            )}

            {/* Comments List */}
            {showComments && comments && (
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-thin">
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
            <div className="border-t border-border pt-3">
              <form
                className="flex items-center gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddComment(post.id);
                }}
              >
                <input
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </article>
      )}
    </div>
  );
}

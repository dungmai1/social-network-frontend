"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, FileX } from "lucide-react";
import { getPostById, savePost } from "@/services/post.service";
import { PostModel } from "@/types/post";
import Post from "@/components/post/Post";
import Header from "@/components/layout/Header";
import Link from "next/link";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [post, setPost] = useState<PostModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const postId = parseInt(id, 10);
        if (isNaN(postId)) {
          setError("Invalid post ID");
          return;
        }
        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSavePost = useCallback(async (postId: number) => {
    try {
      await savePost(postId);
      setPost((prev) => (prev ? { ...prev, saved: !prev.saved } : prev));
    } catch (error) {
      console.error("Failed to save post", error);
    }
  }, []);

  const handleUpdatePost = useCallback((updatedPost: PostModel) => {
    setPost(updatedPost);
  }, []);

  const handleDeletePost = useCallback(
    (postId: number) => {
      router.back();
    },
    [router]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Loading skeleton */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-lg">
            {/* Header skeleton */}
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
            </div>
            
            {/* Image skeleton */}
            <div className="aspect-square bg-muted animate-pulse flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
            
            {/* Actions skeleton */}
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                <div className="h-6 w-6 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="glass-card rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-destructive/10 flex items-center justify-center">
              {error ? (
                <AlertCircle className="w-8 h-8 text-destructive" />
              ) : (
                <FileX className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-2">
              {error ? "Error Loading Post" : "Post Not Found"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "The post you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => router.back()}
                className="px-5 py-2.5 bg-muted hover:bg-muted/80 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              <Link
                href="/"
                className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-medium transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-4">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        
        {/* Post */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-lg hover-lift">
          <Post
            post={post}
            onSavePost={handleSavePost}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
          />
        </div>
        
        {/* Comments section could go here */}
      </div>
    </div>
  );
}

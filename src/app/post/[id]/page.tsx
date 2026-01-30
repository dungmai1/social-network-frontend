"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostById, savePost } from "@/services/post.service";
import { PostModel } from "@/types/post";
import Post from "@/components/post/Post";
import Header from "@/components/layout/Header";

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
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg" />
            <div className="h-96 bg-gray-200 rounded-lg" />
            <div className="h-24 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-gray-500 mb-4">
            {error || "Post not found"}
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-4">
        <Post
          post={post}
          onSavePost={handleSavePost}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
        />
      </div>
    </div>
  );
}

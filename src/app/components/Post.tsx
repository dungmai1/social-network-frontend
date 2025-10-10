"use client";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { PostModel } from "../types/post";
import { formatDate } from "../(libs)/date";
import { getAllPost } from "../services/post.service";
import { getLike } from "../services/like.service";

type Like = {
  likeCount: number;
  liked: boolean;
};
export default function Post() {
  const [postLists, setPostLists] = useState<PostModel[]>([]);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [like, setLike] = useState<Like>();
  const handleLikeToggle = async (postId: number) => {
    const res = await getLike(postId);
    if (res) {
      setLike(res);
      setIsLiked(res.liked);
    }
  };
  useEffect(() => {
    const fetchDataPost = async () => {
      const data = await getAllPost();
      if (data) {
        setPostLists(data);
      }
    };
    fetchDataPost();
  }, []);
  return (
    <div>
      {postLists.map((post) => (
        <article className="bg-white border rounded-md overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <img
                src={post.avatar}
                alt={""}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{post.displayName}</div>
              <div className="text-xs text-gray-500">
                {formatDate(post.postTime)}
              </div>
            </div>
            <div className="text-gray-400">...</div>
          </div>

          <div className="w-full h-96 bg-gray-100">
            <img
              src={`https://picsum.photos/seed/post-$/1200/900`}
              alt="post"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLikeToggle(post.id)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Heart
                  fill={isLiked ? "red" : "none"}
                  stroke={isLiked ? "red" : "black"}
                />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <MessageCircle />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <Send />
              </button>
            </div>

            <div className="mt-2 text-sm">
              <div className="font-semibold">{post.likeCount}</div>
              <div className="mt-1">
                <span className="font-semibold mr-2">{post.displayName}</span>
                <span className="text-gray-700">
                  {"This is a sample caption showing how the post will look."}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                View all {post.commentCount} comments
              </div>
            </div>

            <div className="mt-3 border-t pt-3">
              <form className="flex items-center gap-2">
                <input
                  className="flex-1 outline-none text-sm"
                  placeholder="Add a comment..."
                />
                <button className="text-sm font-medium opacity-60">Post</button>
              </form>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

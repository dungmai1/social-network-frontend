"use client";
import { Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { PostModel } from "../types/post";
import { CommentModel } from "../types/comment";
import { formatDate } from "../(libs)/date";
import { getAllPost } from "../services/post.service";
import { getLike } from "../services/like.service";
import { getAllComment } from "../services/comment.service";

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
    <div className="space-y-6">
      {postLists.map((post) => (
        <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
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
              <div className="text-sm font-semibold text-gray-900">{post.displayName}</div>
              <div className="text-xs text-gray-500">
                {formatDate(post.postTime)}
              </div>
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100 transition">
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
          <div className="p-4">
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => handleLikeToggle(post.id)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <Heart
                  size={24}
                  fill={isLiked ? "#ef4444" : "none"}
                  stroke={isLiked ? "#ef4444" : "#374151"}
                  className="transition-colors"
                />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                <MessageCircle size={24} className="text-gray-700" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                <Send size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Likes */}
            <div className="text-sm font-semibold text-gray-900 mb-2">
              {post.likeCount} likes
            </div>

            {/* Caption */}
            <div className="text-sm mb-2">
              <span className="font-semibold text-gray-900 mr-2">{post.displayName}</span>
              <span className="text-gray-700">
                {post.content || "This is a sample caption showing how the post will look."}
              </span>
            </div>

            {/* Comments */}
            <div 
              className="text-xs text-gray-500 mb-3 cursor-pointer hover:text-gray-700 transition"
              onClick={() => {}}
            >
              {/* {showComments[post.id] ? 'Hide comments' : `View all ${post.commentCount} comments`} */}
            </div>

            {/* {showComments[post.id] && ( */}
              <div className="space-y-3 mb-3">
                {/* Sample comment for UI preview - replace with your data */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src="https://picsum.photos/seed/user1/40"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900 mr-2">
                        username
                      </span>
                      <span className="text-gray-700">This is a sample comment</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      2h
                    </div>
                  </div>
                </div>
                
                {/* Add more sample comments or replace with your data mapping */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src="https://picsum.photos/seed/user2/40"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900 mr-2">
                        another_user
                      </span>
                      <span className="text-gray-700">Nice post! 👍</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      1h
                    </div>
                  </div>
                </div>
              </div>

            {/* Add Comment */}
            <div className="border-t border-gray-100 pt-3">
              <form className="flex items-center gap-3">
                <input
                  className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-500"
                  placeholder="Add a comment..."
                />
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                  Post
                </button>
              </form>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import {
  Grid3X3,
  Bookmark,
  UserCheck,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import useUser from "@/hooks/useUser";
import { usePost } from "@/hooks/usePost";
import { useLike } from "@/hooks/useLike";
import { useComment } from "@/hooks/useComment";
import { PostModel } from "@/types/post";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Post from "@/app/(home)/components/Post";
import useRelationship from "@/hooks/useRelationship";
function ProfilePostItem({ post }: { post: PostModel }) {
  const { likeCount } = useLike(post);
  const { commentCount } = useComment(post);
  return (
    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer relative">
      <img
        src={post.imageUrl}
        alt="Post"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-6 text-white transition-opacity duration-200">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-sm font-semibold">{likeCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            <span className="text-sm font-semibold">{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params);
  const { getUserInfo, userInfo } = useUser();
  const {countFollower, countFollowing} = useRelationship(username);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">(
    "posts"
  );
  const { postsByUserQuery } = usePost(username);
  const { data: userPosts, isLoading: isUserLoading, isError: isUserError, refetch: refetchUser } = postsByUserQuery;
  const safeUserPosts = userPosts ?? [];

  const [showDialog, setShowDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostModel | null>(null);

  // Mock data for demonstration
  const stats = {
    posts: safeUserPosts.length,
    followers: countFollower ?? 0,
    following: countFollowing ?? 0,
  };

  const tabs = [
    { id: "posts" as const, label: "Posts", icon: Grid3X3 },
    { id: "saved" as const, label: "Saved", icon: Bookmark },
    { id: "tagged" as const, label: "Tagged", icon: UserCheck },
  ];
  useEffect(() => {
    getUserInfo(username);
  }, [username])
  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      {/* Profile Header */}
      <div className="px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="flex justify-center md:justify-start">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={
                  userInfo?.avatar || "https://picsum.photos/seed/avatar/400/400"
                }
                alt={userInfo?.displayname || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            {/* Username and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h1 className="text-2xl font-light text-gray-900">
                {userInfo?.username || "username"}
              </h1>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-sm rounded-md transition">
                  Edit profile
                </button>
                <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-sm rounded-md transition">
                  Share profile
                </button>
                <button className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition">
                  <Settings size={16} />
                </button>
                <button className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 text-sm">
              <div>
                <span className="font-semibold text-gray-900">
                  {stats.posts}
                </span>
                <span className="text-gray-600 ml-1">posts</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  {stats.followers}
                </span>
                <span className="text-gray-600 ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  {stats.following}
                </span>
                <span className="text-gray-600 ml-1">following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <div className="font-semibold text-gray-900">
                {userInfo?.displayname || "Display Name"}
              </div>
              <div className="text-gray-900">
                This is a sample bio for the Instagram-like profile page. You
                can add your own bio content here.
              </div>
              <div className="text-blue-600 text-sm">
                <a href="#" className="hover:underline">
                  example.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-8 py-4 text-sm font-medium border-t-2 transition ${activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-4">
        {activeTab === "posts" && (
          <>
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {safeUserPosts.length > 0 ? (
                safeUserPosts.map((post) => (
                  <div key={post.id} onClick={() => { setSelectedPost(post); setShowDialog(true) }}>
                    <ProfilePostItem post={post} />
                  </div>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-500">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
                    <Grid3X3 size={24} />
                  </div>
                  <h3 className="text-xl font-light mb-2">No Posts Yet</h3>
                  <p className="text-sm">
                    When you share photos and videos, they'll appear on your
                    profile.
                  </p>
                </div>
              )}
            </div>
            {/* Popup chi tiết post */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent className="overflow-auto max-h-[80vh]">
                {selectedPost && <Post post={selectedPost} />}
              </DialogContent>
            </Dialog>
          </>
        )}

        {activeTab === "saved" && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
              <Bookmark size={24} />
            </div>
            <h3 className="text-xl font-light mb-2">Saved Posts</h3>
            <p className="text-sm">
              Save photos and videos that you want to see again.
            </p>
          </div>
        )}

        {activeTab === "tagged" && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
              <UserCheck size={24} />
            </div>
            <h3 className="text-xl font-light mb-2">Photos of You</h3>
            <p className="text-sm">
              When people tag you in photos, they'll appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

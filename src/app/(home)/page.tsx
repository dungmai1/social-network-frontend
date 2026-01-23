"use client";

import React, { useCallback, useMemo, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Search,
  Clapperboard,
  Home as HomeIcon,
  Compass,
  User,
  Film,
  Plus,
} from "lucide-react";
import Post from "@/components/post/Post";
import { usePost } from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import CreatePostInline from "@/components/post/CreatePostInline";
import useRelationship from "@/hooks/useRelationship";
import Header from "@/components/layout/Header";

export default function Home() {
  const { allPostsQuery, savePostMutation } = usePost();
  const { userCurrent } = useUser();
  const {
    data: allPostsPages,
    isLoading: isAllLoading,
    isError: isAllError,
    refetch: refetchAll,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = allPostsQuery;
  const {
    listRecommend,
    isLoadingRecommend,
    handleRecommendUser,
    handleAddFollow,
  } = useRelationship(userCurrent?.username ?? "");

  const allPosts = useMemo(
    () => ({
      data: allPostsPages?.pages?.flatMap((page) => page?.data ?? []) ?? [],
    }),
    [allPostsPages],
  );
  const triggerRef = useRef(null);

  const handleIntersect = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSavePost = useCallback(
    async (postId: number) => {
      try {
        await savePostMutation.mutateAsync(postId);
      } catch (error) {
        console.error("Failed to save post", error);
      }
    },
    [savePostMutation],
  );

  useIntersectionObserver({
    target: triggerRef as any,
    onIntersect: handleIntersect,
    enabled: !!hasNextPage,
    threshold: 0,
  });
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto px-4 lg:px-8 pt-6 pb-20 grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-6 max-w-7xl">
        {/* SIDEBAR LEFT */}
        <aside className="hidden lg:block">
          <nav className="sticky top-20 space-y-1 py-4">
            <SidebarItem icon={<HomeIcon size={24} />} label="Home" active />
            <SidebarItem icon={<Search size={24} />} label="Search" />
            <SidebarItem icon={<Compass size={24} />} label="Explore" />
            <SidebarItem icon={<Clapperboard size={24} />} label="Reels" />
            <Link href="/message">
              <SidebarItem
                icon={<MessageCircle size={24} />}
                label="Messages"
              />
            </Link>
            <SidebarItem icon={<Heart size={24} />} label="Notifications" />
            <a
              href="#create-post"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("create-post")
                  ?.scrollIntoView({ behavior: "smooth" });
                document.getElementById("create-post-input")?.focus();
              }}
            >
              <SidebarItem icon={<Plus size={24} />} label="Create" />
            </a>
            <Link href={`/profile/${userCurrent?.username}`}>
              <div className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer group">
                <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-gray-300 transition">
                  <img
                    className="w-full h-full object-cover"
                    src={userCurrent?.avatar}
                    alt={userCurrent?.username || "User"}
                  />
                </div>
                <span className="font-normal text-gray-900">Profile</span>
              </div>
            </Link>
          </nav>
        </aside>

        {/* FEED CENTER */}
        <section className="w-full max-w-[470px] mx-auto">
          {/* Create Post */}
          <div id="create-post" className="mb-4">
            <CreatePostInline
              userAvatar={userCurrent?.avatar}
              username={userCurrent?.username}
            />
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {isAllLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-2 w-16 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-200 rounded" />
                      <div className="h-3 w-2/3 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              allPosts?.data?.map((post) => (
                <Post key={post.id} post={post} onSavePost={handleSavePost} />
              ))
            )}
            {isAllError && (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">Could not load posts</p>
                <button
                  onClick={() => refetchAll()}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
                >
                  Try again
                </button>
              </div>
            )}
          </div>

          {/* Load more trigger */}
          {allPosts?.data && allPosts?.data?.length > 0 && (
            <>
              {isFetchingNextPage && (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}
              <div ref={triggerRef}></div>
            </>
          )}
        </section>

        {/* SIDEBAR RIGHT */}
        <aside className="hidden xl:block">
          <div className="sticky top-20 space-y-5 py-4">
            {/* Current User */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden">
                  <img
                    src={userCurrent?.avatar}
                    alt={userCurrent?.username || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Link href={`/profile/${userCurrent?.username}`}>
                    <p className="text-sm font-semibold text-gray-900 hover:underline">
                      {userCurrent?.username}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-400">
                    {userCurrent?.displayname || userCurrent?.username}
                  </p>
                </div>
              </div>
              <button className="text-xs font-semibold text-blue-500 hover:text-blue-700">
                Switch
              </button>
            </div>

            {/* Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-500">
                  Suggested for you
                </span>
                <button
                  className="text-xs font-semibold text-gray-900 hover:text-gray-600"
                  onClick={handleRecommendUser}
                >
                  See All
                </button>
              </div>

              <div className="space-y-3">
                {isLoadingRecommend ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between animate-pulse"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gray-200" />
                          <div className="space-y-1.5">
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                            <div className="h-2.5 w-20 bg-gray-100 rounded" />
                          </div>
                        </div>
                        <div className="h-4 w-12 bg-gray-100 rounded" />
                      </div>
                    ))}
                  </div>
                ) : listRecommend.length > 0 ? (
                  <ul className="space-y-3">
                    {listRecommend.map((suggestion) => (
                      <li
                        key={suggestion.id ?? suggestion.username}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Link href={`/profile/${suggestion.username}`}>
                            <img
                              src={
                                suggestion.avatar ||
                                `https://picsum.photos/seed/${suggestion.username}/44`
                              }
                              className="w-11 h-11 rounded-full object-cover"
                              alt={suggestion.username}
                            />
                          </Link>
                          <div>
                            <Link href={`/profile/${suggestion.username}`}>
                              <p className="text-sm font-semibold text-gray-900 hover:underline">
                                {suggestion.username}
                              </p>
                            </Link>
                            <p className="text-xs text-gray-400">
                              {suggestion.displayname || "Suggested for you"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddFollow(suggestion.username)}
                          className="text-xs font-semibold text-blue-500 hover:text-blue-700"
                        >
                          Follow
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-400 text-center py-4">
                    No suggestions available
                    <button
                      className="block w-full text-xs text-blue-500 font-semibold mt-2 hover:text-blue-700"
                      onClick={handleRecommendUser}
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Links */}
            <div className="pt-6 space-y-4">
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400">
                <a href="#" className="hover:underline">
                  About
                </a>
                <span>·</span>
                <a href="#" className="hover:underline">
                  Help
                </a>
                <span>·</span>
                <a href="#" className="hover:underline">
                  Press
                </a>
                <span>·</span>
                <a href="#" className="hover:underline">
                  API
                </a>
                <span>·</span>
                <a href="#" className="hover:underline">
                  Jobs
                </a>
                <span>·</span>
                <a href="#" className="hover:underline">
                  Privacy
                </a>
                <span>·</span>
                <a href="#" className="hover:underline">
                  Terms
                </a>
              </div>
              <p className="text-xs text-gray-400">© 2026 Instagram Clone</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 z-50">
        <div className="flex items-center justify-around">
          <Link href="/">
            <div className="p-2">
              <HomeIcon size={24} className="text-gray-900" />
            </div>
          </Link>
          <div className="p-2">
            <Search size={24} className="text-gray-600" />
          </div>
          <div className="p-2">
            <Plus size={24} className="text-gray-600" />
          </div>
          <div className="p-2">
            <Film size={24} className="text-gray-600" />
          </div>
          <Link href={`/profile/${userCurrent?.username}`}>
            <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-gray-900">
              <img
                className="w-full h-full object-cover"
                src={userCurrent?.avatar}
                alt={userCurrent?.username || "User"}
              />
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 px-3 py-3 rounded-lg transition cursor-pointer hover:bg-gray-100 ${
        active ? "font-bold" : "font-normal"
      }`}
    >
      <span className={active ? "text-gray-900" : "text-gray-700"}>{icon}</span>
      <span className="text-gray-900">{label}</span>
    </div>
  );
}

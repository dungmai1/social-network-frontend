"use client";

import React, { useCallback, useMemo, useRef } from "react";
import { Heart, MessageCircle, Search, Clapperboard, Home as HomeIcon, Compass, User, Film, Plus } from "lucide-react";
import Avatar from "./components/Avatar";
import Post from "./components/Post";
import { usePost } from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import CreatePostDialog from "./components/CreatePostDialog";
import useRelationship from "@/hooks/useRelationship";
import Header from "./components/Header";

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
    [allPostsPages]
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
    [savePostMutation]
  );

  useIntersectionObserver({
    target: triggerRef as any,
    onIntersect: handleIntersect,
    enabled: !!hasNextPage,
    threshold: 0,
  });
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="mx-auto px-2 md:px-8 mt-6 grid grid-cols-1 md:grid-cols-[220px_1fr_320px] gap-8 max-w-7xl">
        {/* SIDEBAR LEFT */}
        <aside className="hidden md:block w-[200px] pt-2">
          <nav className="sticky top-28 space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white hover:shadow-lg hover:bg-gray-50 transition cursor-pointer group">
              <HomeIcon size={22} className="text-indigo-600 group-hover:scale-110 transition" />
              <span className="font-medium text-gray-800 text-base">Home</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white hover:shadow-lg hover:bg-gray-50 transition cursor-pointer group">
              <Compass size={22} className="text-pink-500 group-hover:scale-110 transition" />
              <span className="font-medium text-gray-800 text-base">Explore</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white hover:shadow-lg hover:bg-gray-50 transition cursor-pointer group">
              <Clapperboard size={22} className="text-teal-600 group-hover:scale-110 transition" />
              <span className="font-medium text-gray-800 text-base">Reels</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white hover:shadow-lg hover:bg-gray-50 transition cursor-pointer group">
              <MessageCircle size={22} className="text-emerald-600 group-hover:scale-110 transition" />
              <span className="font-medium text-gray-800 text-base">Message</span>
            </div>
            <CreatePostDialog
              trigger={
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl bg-white p-3 transition hover:bg-gray-50 hover:shadow-lg group"
                >
                  <Plus size={22} className="text-emerald-600 transition group-hover:scale-110" />
                  <span className="text-base font-medium text-gray-800">Create</span>
                </button>
              }
            />
            <Link href={`/profile/${userCurrent?.username}`}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white hover:shadow-lg hover:bg-gray-50 transition cursor-pointer group">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200">
                  <img
                    className="w-full h-full object-cover"
                    src={userCurrent?.avatar}
                    alt={userCurrent?.username || "User"}
                  />
                </div>
                <span className="font-medium text-gray-800 text-base">Profile</span>
              </div>
            </Link>
          </nav>
        </aside>
        {/* FEED CENTER */}
        <section className="md:col-span-1 lg:col-start-2 lg:col-end-3 w-full flex flex-col items-center">
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-7 border border-gray-100 w-full max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                <img
                  src={userCurrent?.avatar || `https://picsum.photos/seed/${userCurrent?.username || "create"}/80`}
                  alt={userCurrent?.username || "User"}
                  className="h-full w-full object-cover"
                />
              </div>
              <CreatePostDialog
                trigger={
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 text-left text-sm text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-700">Chia sẻ điều gì đó...</span>
                    <Plus size={18} className="text-emerald-600" />
                  </button>
                }
              />
            </div>
          </div>
          <div className="w-full max-w-2xl space-y-3">
            {isAllLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ) : (
              allPosts?.data?.map((post) => (
                <Post key={post.id} post={post} onSavePost={handleSavePost} 
                />
              ))
            )}
            {
              isAllError && (
                <div className="p-5 text-center">
                  <p className="text-red-500 mb-3 text-lg font-semibold">Không thể tải bình luận 😥</p>
                  <button
                    onClick={() => refetchAll()}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-sm transition text-base"
                  >
                    Thử lại
                  </button>
                </div>
              )
            }
          </div>
          {allPosts?.data && allPosts?.data?.length > 0 && (
            <>
              {isFetchingNextPage && (
                <div className="py-4 text-gray-500 text-sm">Đang tải thêm...</div>
              )}
              <div ref={triggerRef}></div>
            </>
          )}
        </section>
        {/* SIDEBAR RIGHT */}
        <aside className="hidden lg:block pt-2 w-full max-w-xs">
          <div className="sticky top-20 space-y-6">
            <Avatar />
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="text-base text-gray-600 font-semibold">
                  Suggested for you
                </div>
                <button
                  className="text-xs text-indigo-500 hover:text-indigo-700 font-bold"
                  onClick={handleRecommendUser}
                >
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                {isLoadingRecommend ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, idx) => (
                      <div key={idx} className="flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200" />
                          <div className="space-y-1">
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                            <div className="h-2 w-16 bg-gray-100 rounded" />
                          </div>
                        </div>
                        <div className="h-6 w-16 bg-gray-100 rounded" />
                      </div>
                    ))}
                  </div>
                ) : listRecommend.length > 0 ? (
                  <ul className="space-y-3">
                    {listRecommend.map((suggestion) => (
                      <li
                        key={suggestion.id ?? suggestion.username}
                        className="flex items-center justify-between hover:bg-gray-50 rounded-xl transition p-2"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              suggestion.avatar ||
                              `https://picsum.photos/seed/${suggestion.username}/40`
                            }
                            className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            alt={suggestion.username}
                          />
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              {suggestion.username}
                            </div>
                            <div className="text-xs text-gray-400">
                              {suggestion.displayname || "Suggested for you"}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddFollow(suggestion.username)}
                          className="text-xs px-4 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 font-semibold rounded-lg shadow-xs transition border border-blue-100"
                        >
                          Follow
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-400 text-center py-3">
                    No suggestions available right now.
                    <button
                      className="block w-full text-xs text-indigo-500 font-semibold mt-2 hover:text-indigo-700"
                      onClick={handleRecommendUser}
                    >
                      Refresh suggestions
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-400 text-center pt-5">
              © InstaClone • About • Help
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

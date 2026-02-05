"use client";

import React, { useCallback, useMemo, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Search,
  Home as HomeIcon,
  Compass,
  User,
  Film,
  Plus,
  TrendingUp,
  Users,
  Sparkles,
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
    followedUsers,
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto px-4 lg:px-8 pt-6 pb-24 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-8 max-w-7xl">
        {/* SIDEBAR LEFT */}
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-2 py-4">
            <SidebarItem
              icon={<HomeIcon size={22} />}
              label="Home"
              active
              href="/"
            />
            <SidebarItem
              icon={<Compass size={22} />}
              label="Explore"
              href="/explore"
            />
            <SidebarItem
              icon={<MessageCircle size={22} />}
              label="Messages"
              href="/message"
            />
            <SidebarItem
              icon={<Heart size={22} />}
              label="Notifications"
              href="/notifications"
            />
            <SidebarItem
              icon={<Plus size={22} />}
              label="Create Post"
              href="#create-post"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("create-post")
                  ?.scrollIntoView({ behavior: "smooth" });
                document.getElementById("create-post-input")?.focus();
              }}
            />
            <SidebarItem
              icon={<User size={22} />}
              label="Profile"
              href={`/profile/${userCurrent?.username}`}
              avatar={userCurrent?.avatar}
            />

            {/* Divider */}
            <div className="my-4 border-t border-border" />

            {/* Quick Stats */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 rounded-lg bg-accent/30">
                  <p className="text-lg font-bold text-foreground">
                    {allPosts?.data?.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-accent/30">
                  <p className="text-lg font-bold text-foreground">
                    {listRecommend?.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Suggestions</p>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* FEED CENTER */}
        <section className="w-full max-w-[520px] mx-auto">
          {/* Create Post */}
          <div id="create-post" className="mb-6">
            <CreatePostInline
              userAvatar={userCurrent?.avatar}
              username={userCurrent?.username}
            />
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {isAllLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="glass-card rounded-2xl p-4 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-28 bg-muted rounded-full" />
                        <div className="h-2 w-20 bg-muted/50 rounded-full" />
                      </div>
                    </div>
                    <div className="aspect-square bg-muted/50 rounded-xl mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted rounded-full" />
                      <div className="h-3 w-2/3 bg-muted/50 rounded-full" />
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
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={28} className="text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Could not load posts
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Something went wrong. Please try again.
                </p>
                <button
                  onClick={() => refetchAll()}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-colors cursor-pointer"
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
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Loading more...
                    </span>
                  </div>
                </div>
              )}
              <div ref={triggerRef}></div>
            </>
          )}
        </section>

        {/* SIDEBAR RIGHT */}
        <aside className="hidden xl:block">
          <div className="sticky top-28 space-y-6 py-4">
            {/* Current User Card */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Link href={`/profile/${userCurrent?.username}`}>
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/30 hover:ring-primary transition-all cursor-pointer">
                    <img
                      src={userCurrent?.avatar}
                      alt={userCurrent?.username || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${userCurrent?.username}`}>
                    <p className="font-semibold text-foreground hover:text-primary transition-colors truncate cursor-pointer">
                      {userCurrent?.username}
                    </p>
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">
                    {userCurrent?.displayname || "Welcome back!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  Suggested for you
                </h3>
                <button
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
                  onClick={handleRecommendUser}
                >
                  Refresh
                </button>
              </div>

              <div className="p-2">
                {isLoadingRecommend ? (
                  <div className="space-y-1">
                    {[...Array(5)].map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 animate-pulse"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-muted" />
                          <div className="space-y-1.5">
                            <div className="h-3 w-24 bg-muted rounded-full" />
                            <div className="h-2.5 w-20 bg-muted/50 rounded-full" />
                          </div>
                        </div>
                        <div className="h-8 w-16 bg-muted rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : listRecommend.length > 0 ? (
                  <ul className="space-y-1">
                    {listRecommend.map((suggestion) => {
                      const isFollowed = followedUsers.includes(
                        suggestion.username
                      );
                      return (
                        <li
                          key={suggestion.id ?? suggestion.username}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Link href={`/profile/${suggestion.username}`}>
                              <img
                                src={
                                  suggestion.avatar ||
                                  `https://picsum.photos/seed/${suggestion.username}/44`
                                }
                                className="w-11 h-11 rounded-full object-cover ring-2 ring-transparent hover:ring-primary/30 transition-all cursor-pointer"
                                alt={suggestion.username}
                              />
                            </Link>
                            <div className="min-w-0">
                              <Link href={`/profile/${suggestion.username}`}>
                                <p className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate cursor-pointer">
                                  {suggestion.username}
                                </p>
                              </Link>
                              <p className="text-xs text-muted-foreground truncate">
                                {suggestion.displayname || "Suggested for you"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              !isFollowed &&
                              handleAddFollow(suggestion.username)
                            }
                            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                              isFollowed
                                ? "bg-muted text-muted-foreground"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}
                          >
                            {isFollowed ? "Following" : "Follow"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                      <Users size={20} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      No suggestions available
                    </p>
                    <button
                      className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer"
                      onClick={handleRecommendUser}
                    >
                      Refresh suggestions
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Links */}
            <div className="px-2 space-y-4">
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">
                  About
                </a>
                <span>·</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help
                </a>
                <span>·</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  Press
                </a>
                <span>·</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  API
                </a>
                <span>·</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  Jobs
                </a>
                <span>·</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
                <span>·</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms
                </a>
              </div>
              <p className="text-xs text-muted-foreground">
                © 2026 SocialHub. Built with Next.js
              </p>
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-border px-6 py-2 z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link href="/">
            <div className="p-3 rounded-xl bg-primary/10 text-primary cursor-pointer">
              <HomeIcon size={24} />
            </div>
          </Link>
          <Link href="/explore">
            <div className="p-3 rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <Search size={24} />
            </div>
          </Link>
          <a
            href="#create-post"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("create-post")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="p-3 rounded-xl bg-primary text-primary-foreground shadow-lg hover-lift cursor-pointer">
              <Plus size={24} />
            </div>
          </a>
          <Link href="/message">
            <div className="p-3 rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <MessageCircle size={24} />
            </div>
          </Link>
          <Link href={`/profile/${userCurrent?.username}`}>
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/50 cursor-pointer">
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
  href,
  avatar,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href: string;
  avatar?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const content = (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer ${
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-foreground hover:bg-accent/50"
      }`}
    >
      {avatar ? (
        <div className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-primary/30">
          <img className="w-full h-full object-cover" src={avatar} alt={label} />
        </div>
      ) : (
        <span className={active ? "text-primary" : "text-muted-foreground"}>
          {icon}
        </span>
      )}
      <span>{label}</span>
    </div>
  );

  if (onClick) {
    return (
      <a href={href} onClick={onClick}>
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}

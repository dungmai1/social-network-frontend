"use client";

import React from "react";
import { Heart, MessageCircle, Search, Clapperboard, Home as HomeIcon, Compass, User, Film } from "lucide-react";
import Avatar from "./components/Avatar";
import Post from "./components/Post";
import { usePost } from "@/hooks/usePost";
import useUser from "@/hooks/useUser";
import Link from "next/link";

function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-20">
      <div className="mx-auto px-6 py-3 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-gray-900 select-none">
            Instagram
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 text-sm bg-gray-50">
            <Search size={18} className="text-gray-500" />
            <input
              className="bg-transparent outline-none w-36 sm:w-64 text-gray-700 placeholder-gray-500 text-sm"
              placeholder="Search"
            />
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition">
            <Heart size={20} className="text-gray-700" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition">
            <MessageCircle size={20} className="text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Story({ name }: any) {
  return (
    <div className="flex flex-col items-center w-20 group cursor-pointer">
      <div className="w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden group-hover:border-gray-400 transition">
        <img
          src={`https://picsum.photos/seed/${name}/80`}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-xs mt-2 truncate w-full text-center text-gray-700 font-medium">
        {name}
      </div>
    </div>
  );
}

export default function Home() {
  const { allPostsQuery } = usePost();
  const { user } = useUser();
  const { data: allPosts, isLoading: isAllLoading, isError: isAllError, refetch: refetchAll } = allPostsQuery;
  const stories = [
    "you",
    "alice",
    "bob",
    "charlie",
    "david",
    "eva",
    "frank",
    "gina",
  ];
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
            <Link href={`/profile/${user?.username}`}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white hover:shadow-lg hover:bg-gray-50 transition cursor-pointer group">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200">
                <img
                  className="w-full h-full object-cover"
                  src={user?.avatar}
                  alt={user?.username || "User"}
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
            <div className="flex gap-5 overflow-x-auto pb-3 px-2">
              {stories.map((s) => (
                <Story key={s} name={s} />
              ))}
            </div>
          </div>
          <div className="w-full max-w-2xl space-y-3">
            {isAllLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ) : (
              allPosts?.map((post) => (
                <Post key={post.id} post={post} />
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
                <button className="text-xs text-indigo-500 hover:text-indigo-700 font-bold">
                  See All
                </button>
              </div>
              <ul className="space-y-3">
                {['anna', 'brian', 'carl'].map((s) => (
                  <li key={s} className="flex items-center justify-between hover:bg-gray-50 rounded-xl transition p-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://picsum.photos/seed/${s}/40`}
                        className="w-10 h-10 rounded-full border border-gray-200"
                        alt={s}
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {s}
                        </div>
                        <div className="text-xs text-gray-400">Suggested</div>
                      </div>
                    </div>
                    <button className="text-xs px-4 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 font-semibold rounded-lg shadow-xs transition border border-blue-100">
                      Follow
                    </button>
                  </li>
                ))}
              </ul>
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

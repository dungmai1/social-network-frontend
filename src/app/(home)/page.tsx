"use client";

import React from "react";
import { Heart, MessageCircle, Search, Clapperboard } from "lucide-react";
import Avatar from "./components/Avatar";
import Post from "./components/Post";
import { usePost } from "@/hooks/usePost";

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
  const { allPostsQuery} = usePost();
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
      <main className="mx-auto px-2 md:px-6 mt-4 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        {/* SIDEBAR LEFT */}
        <aside className="hidden md:block w-64 pt-2">
          <nav className="sticky top-28 space-y-1">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition cursor-pointer">
              <Clapperboard size={22} className="text-gray-700" />
              <span className="font-medium text-gray-800">Home</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition cursor-pointer">
              <Clapperboard size={22} className="text-gray-700" />
              <span className="font-medium text-gray-800">Explore</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition cursor-pointer">
              <span className="font-medium text-gray-800">Reels</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition cursor-pointer">
              <Clapperboard size={22} className="text-gray-700" />
              <span className="font-medium text-gray-800">Profile</span>
            </div>
          </nav>
        </aside>
        {/* FEED CENTER */}
        <section className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {stories.map((s) => (
                <Story key={s} name={s} />
              ))}
            </div>
          </div>
          <div className="space-y-6">
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
                <div className="p-4 text-center">
                <p className="text-red-500 mb-2">Không thể tải bình luận 😥</p>
                <button
                  onClick={() => refetchAll()}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
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
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600 font-medium">
                  Suggested for you
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  See All
                </button>
              </div>
              <ul className="space-y-3">
                {["anna", "brian", "carl"].map((s) => (
                  <li key={s} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://picsum.photos/seed/${s}/40`}
                        className="w-9 h-9 rounded-full border border-gray-200"
                        alt={s}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {s}
                        </div>
                        <div className="text-xs text-gray-500">Suggested</div>
                      </div>
                    </div>
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Follow
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-xs text-gray-400 text-center pt-3">
              © InstaClone • About • Help
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

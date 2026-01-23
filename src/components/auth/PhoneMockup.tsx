"use client";
import React from "react";

interface PhoneMockupProps {
  variant?: "profile" | "feed";
  className?: string;
}

export default function PhoneMockup({
  variant = "profile",
  className = "",
}: PhoneMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame */}
      <div className="w-[280px] h-[560px] bg-gray-900 rounded-[40px] p-3 shadow-2xl">
        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
          {/* Status Bar */}
          <div className="h-8 bg-white flex items-center justify-between px-6 pt-2">
            <span className="text-xs font-semibold">9:30</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-gray-800 rounded-sm"></div>
              <div className="w-4 h-2 bg-gray-800 rounded-sm"></div>
              <div className="w-6 h-3 bg-gray-800 rounded-sm"></div>
            </div>
          </div>

          {/* Content */}
          {variant === "profile" ? <ProfileScreen /> : <FeedScreen />}

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex items-center justify-around px-4">
            <NavIcon icon="home" active={variant === "feed"} />
            <NavIcon icon="search" />
            <NavIcon icon="add" />
            <NavIcon icon="heart" />
            <NavIcon icon="profile" active={variant === "profile"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="p-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold">ted4designs</span>
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </div>

      {/* Profile Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
          <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
            D
          </div>
        </div>
        <div className="flex-1 flex justify-around text-center">
          <div>
            <div className="font-bold text-sm">381</div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div>
            <div className="font-bold text-sm">3,067</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div>
            <div className="font-bold text-sm">289</div>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <div className="text-sm font-semibold">Ted Kulakevich</div>
        <div className="text-xs text-gray-500">
          Branding, Illustration and UI/UX
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-4">
        <button className="flex-1 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold">
          Edit Profile
        </button>
        <button className="flex-1 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold">
          Insights
        </button>
        <button className="flex-1 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold">
          Contact
        </button>
      </div>

      {/* Story Highlights */}
      <div className="flex gap-3 mb-4 overflow-x-auto">
        {[
          "Icons",
          "Branding",
          "Youtube Vids",
          "Logo Works",
          "Illustrations",
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 bg-gray-100 mb-1"></div>
            <span className="text-[10px] text-gray-600 truncate w-12 text-center">
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200"></div>
        ))}
      </div>
    </div>
  );
}

function FeedScreen() {
  return (
    <div className="p-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold">ted4designs</span>
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>

      {/* Stories */}
      <div className="flex gap-3 mb-4 overflow-x-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-0.5">
              <div className="w-full h-full rounded-full bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Post */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <span className="text-xs font-semibold">ted4designs</span>
        </div>
        <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-2 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-2 p-4">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-6 h-6 text-pink-400">
                ✓
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 mb-1">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </div>
        <div className="text-xs">
          <span className="font-semibold">Liked by</span> stidsdesign and 52
          others
        </div>
      </div>
    </div>
  );
}

function NavIcon({ icon, active = false }: { icon: string; active?: boolean }) {
  const iconClass = `w-6 h-6 ${active ? "text-gray-900" : "text-gray-500"}`;

  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg
        className={iconClass}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    search: (
      <svg
        className={iconClass}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    add: (
      <svg
        className={iconClass}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    heart: (
      <svg
        className={iconClass}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    profile: (
      <svg
        className={iconClass}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  };

  return icons[icon] || null;
}

"use client";
import React from "react";
import { Home, Search, PlusSquare, Heart, User, MessageCircle, MoreVertical, ChevronLeft } from "lucide-react";

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
        <div className="w-full h-full bg-background rounded-[32px] overflow-hidden relative">
          {/* Status Bar */}
          <div className="h-8 bg-background flex items-center justify-between px-6 pt-2">
            <span className="text-xs font-semibold text-foreground">9:30</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-foreground/60 rounded-sm"></div>
              <div className="w-4 h-2 bg-foreground/60 rounded-sm"></div>
              <div className="w-6 h-3 bg-primary rounded-sm"></div>
            </div>
          </div>

          {/* Content */}
          {variant === "profile" ? <ProfileScreen /> : <FeedScreen />}

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 h-14 glass border-t border-border flex items-center justify-around px-4">
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
        <ChevronLeft className="w-5 h-5 text-foreground" />
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-foreground">alex_design</span>
          <span className="w-2 h-2 bg-primary rounded-full pulse-dot"></span>
        </div>
        <MoreVertical className="w-5 h-5 text-foreground" />
      </div>

      {/* Profile Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-pink-500 p-0.5">
          <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-primary font-bold">
            A
          </div>
        </div>
        <div className="flex-1 flex justify-around text-center">
          <div>
            <div className="font-bold text-sm text-foreground">256</div>
            <div className="text-xs text-muted-foreground">Posts</div>
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">4,892</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div>
            <div className="font-bold text-sm text-foreground">312</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-foreground">Alex Designer</div>
        <div className="text-xs text-muted-foreground">
          UI/UX & Product Design
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-4">
        <button className="flex-1 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold border border-primary/20">
          Edit Profile
        </button>
        <button className="flex-1 py-1.5 bg-muted rounded-lg text-xs font-semibold text-foreground">
          Insights
        </button>
        <button className="flex-1 py-1.5 bg-muted rounded-lg text-xs font-semibold text-foreground">
          Share
        </button>
      </div>

      {/* Story Highlights */}
      <div className="flex gap-3 mb-4 overflow-x-auto">
        {["Design", "UI/UX", "Projects", "Team", "Travel"].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 bg-muted/50 mb-1 flex items-center justify-center">
              <span className="text-[10px] text-primary">+</span>
            </div>
            <span className="text-[10px] text-muted-foreground truncate w-12 text-center">
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-sm"
          />
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
        <span className="text-sm font-bold gradient-text">Connectify</span>
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-foreground" />
          <MessageCircle className="w-5 h-5 text-foreground" />
        </div>
      </div>

      {/* Stories */}
      <div className="flex gap-3 mb-4 overflow-x-auto">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-secondary to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full bg-muted"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Post */}
      <div className="mb-4 glass-card rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
          <span className="text-xs font-semibold text-foreground">alex_design</span>
        </div>
        <div className="aspect-square bg-gradient-to-br from-primary/10 via-secondary/10 to-pink-500/10 rounded-lg mb-2 flex items-center justify-center">
          <div className="text-4xl">🎨</div>
        </div>
        <div className="flex items-center gap-3 mb-1">
          <Heart className="w-5 h-5 text-foreground" />
          <MessageCircle className="w-5 h-5 text-foreground" />
        </div>
        <div className="text-xs text-foreground">
          <span className="font-semibold">Liked by</span>{" "}
          <span className="text-muted-foreground">design_team and 128 others</span>
        </div>
      </div>
    </div>
  );
}

function NavIcon({ icon, active = false }: { icon: string; active?: boolean }) {
  const iconClass = `w-6 h-6 ${active ? "text-primary" : "text-muted-foreground"}`;

  const icons: Record<string, React.ReactNode> = {
    home: <Home className={iconClass} fill={active ? "currentColor" : "none"} />,
    search: <Search className={iconClass} />,
    add: <PlusSquare className={iconClass} />,
    heart: <Heart className={iconClass} />,
    profile: <User className={iconClass} fill={active ? "currentColor" : "none"} />,
  };

  return icons[icon] || null;
}

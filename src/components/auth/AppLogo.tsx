"use client";
import React from "react";
import { Users, Sparkles } from "lucide-react";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function AppLogo({
  size = "md",
  showText = true,
}: AppLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const containerPadding = {
    sm: "p-2",
    md: "p-2.5",
    lg: "p-3",
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Logo Icon */}
      <div className={`${containerPadding[size]} relative rounded-xl bg-gradient-to-br from-primary via-secondary to-pink-500 shadow-lg`}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-secondary to-pink-500 blur-md opacity-50" />
        <div className="relative">
          <Users className={`${iconSizes[size]} text-white`} strokeWidth={2} />
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
        </div>
      </div>

      {/* App Name */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-heading font-bold gradient-text`}>
            Connectify
          </span>
          <span className="text-xs text-muted-foreground -mt-1">Community Platform</span>
        </div>
      )}
    </div>
  );
}

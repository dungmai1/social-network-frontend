"use client";
import React from "react";

interface InstagramLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function InstagramLogo({
  size = "md",
  showText = true,
}: InstagramLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Gradient Ring Icon */}
      <div className={`${iconSizes[size]} relative`}>
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <defs>
            <linearGradient
              id="instagram-gradient"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#FFDD55" />
              <stop offset="25%" stopColor="#FF543E" />
              <stop offset="50%" stopColor="#C837AB" />
              <stop offset="75%" stopColor="#FF543E" />
              <stop offset="100%" stopColor="#FFDD55" />
            </linearGradient>
          </defs>
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="url(#instagram-gradient)"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Instagram Text */}
      {showText && (
        <span
          className={`${textSizes[size]} font-semibold text-gray-900`}
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          Instagram
        </span>
      )}
    </div>
  );
}

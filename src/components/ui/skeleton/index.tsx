"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

// Base skeleton component
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-muted rounded ${className}`}
    />
  );
}

// Post skeleton
export function PostSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <Skeleton className="w-6 h-6 rounded" />
      </div>
      
      {/* Image */}
      <Skeleton className="aspect-square w-full rounded-none" />
      
      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex gap-4">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
          <div className="flex-1" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
    </div>
  );
}

// Feed skeleton (multiple posts)
export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}

// Profile header skeleton
export function ProfileHeaderSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Banner */}
      <Skeleton className="h-32 sm:h-48 w-full rounded-none" />
      
      {/* Profile info */}
      <div className="p-6 -mt-12 sm:-mt-16">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
          {/* Avatar */}
          <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-card" />
          
          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-2 pb-2">
            <Skeleton className="h-6 w-40 mx-auto sm:mx-0 rounded" />
            <Skeleton className="h-4 w-24 mx-auto sm:mx-0 rounded" />
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-6 flex justify-center sm:justify-start gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton className="h-6 w-12 mx-auto rounded" />
              <Skeleton className="h-4 w-16 mx-auto rounded" />
            </div>
          ))}
        </div>
        
        {/* Bio */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}

// Conversation list skeleton
export function ConversationListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-48 rounded" />
          </div>
          <Skeleton className="h-3 w-10 rounded" />
        </div>
      ))}
    </div>
  );
}

// User card skeleton
export function UserCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  );
}

// Suggestion list skeleton
export function SuggestionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Comment skeleton
export function CommentSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
    </div>
  );
}

// Comment list skeleton
export function CommentListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}

// Notification skeleton
export function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
      <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
    </div>
  );
}

// Notification list skeleton
export function NotificationListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <NotificationSkeleton key={i} />
      ))}
    </div>
  );
}

// Search result skeleton
export function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
    </div>
  );
}

// Grid skeleton (for photo grids)
export function GridSkeleton({ count = 9, columns = 3 }: { count?: number; columns?: number }) {
  return (
    <div className={`grid grid-cols-${columns} gap-1`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded" />
      ))}
    </div>
  );
}

// Story skeleton
export function StorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-1">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-3 w-12 rounded" />
    </div>
  );
}

// Stories list skeleton
export function StoriesListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <StorySkeleton key={i} />
      ))}
    </div>
  );
}

// Settings section skeleton
export function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 glass-card rounded-xl">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// Full page loading skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="h-16 border-b border-border glass">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Skeleton className="h-8 w-32 rounded" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-64 rounded-xl hidden md:block" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <FeedSkeleton count={2} />
      </div>
    </div>
  );
}

"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Grid3X3,
  Bookmark,
  UserCheck,
  Settings,
  MoreHorizontal,
  Copy,
  Check,
  Camera,
  Heart,
  MessageCircle,
  Share2,
  Link as LinkIcon,
  MapPin,
  Calendar,
  Users,
  UserPlus,
  Mail,
} from "lucide-react";
import useUser from "@/hooks/useUser";
import { usePost } from "@/hooks/usePost";
import { useLike } from "@/hooks/useLike";
import { useComment } from "@/hooks/useComment";
import { PostModel } from "@/types/post";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useRelationship from "@/hooks/useRelationship";
import Header from "@/components/layout/Header";
import QRCodeSVG from "react-qr-code";
import Link from "next/link";

function ProfilePostItem({ post }: { post: PostModel }) {
  const { isLiked, likeCount } = useLike(post);
  const { commentCount } = useComment(post);
  return (
    <div className="aspect-square bg-muted/30 rounded-xl overflow-hidden group cursor-pointer relative">
      <img
        src={post.images?.[0]}
        alt="Post"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-6 text-white transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <Heart
              size={22}
              fill={isLiked ? "#ef4444" : "#ffffff"}
              stroke={isLiked ? "#ef4444" : "none"}
            />
            <span className="text-sm font-semibold">{likeCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={22} fill="#ffffff" stroke="none" />
            <span className="text-sm font-semibold">{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = React.use(params);
  const { getUserInfo, userInfo } = useUser();
  const { handleAddFollow, followersList, followingsList } =
    useRelationship(username);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">(
    "posts"
  );
  const { postsByUserQuery, savedPostsByUserQuery, savePostMutation } =
    usePost(username);
  const {
    data: userPosts,
    isLoading: isUserLoading,
    isError: isUserError,
    refetch: refetchUser,
  } = postsByUserQuery;
  const {
    data: savedPosts,
    isLoading: isSavedLoading,
    isError: isSavedError,
    refetch: refetchSaved,
  } = savedPostsByUserQuery;
  const safeUserPosts = userPosts ?? [];
  const safeSavedPosts = savedPosts ?? [];

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editValues, setEditValues] = useState({
    displayName: userInfo?.username || "",
    bio: userInfo?.description || "",
  });
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingsDialog, setShowFollowingsDialog] = useState(false);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/profile/${username}`
      : "";

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link", error);
    }
  }, [profileUrl]);

  const stats = {
    posts: safeUserPosts.length,
    followers: userInfo?.relationship.followerCount ?? 0,
    following: userInfo?.relationship.followingCount ?? 0,
  };

  const tabs = [
    { id: "posts" as const, label: "Posts", icon: Grid3X3 },
    ...(userInfo?.relationship.self
      ? [{ id: "saved" as const, label: "Saved", icon: Bookmark }]
      : []),
  ];

  useEffect(() => {
    getUserInfo(username);
    setEditValues({
      displayName: userInfo?.username || "",
      bio: userInfo?.description || "",
    });
  }, [username]);

  const handleEditProfile = useCallback(async () => {
    try {
      setShowEditDialog(false);
      refetchUser();
    } catch (error) {
      console.error("Failed to edit profile", error);
    }
  }, [username, editValues, getUserInfo, refetchUser]);

  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {};
        reader.readAsDataURL(file);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Profile Header Section */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Cover Image / Gradient Banner */}
        <div className="relative h-32 sm:h-48 -mx-4 sm:mx-0 sm:rounded-b-3xl overflow-hidden gradient-bg">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="relative -mt-16 sm:-mt-20 pb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex justify-center sm:justify-start">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-background shadow-xl">
                  <img
                    src={
                      userInfo?.avatar ||
                      "https://picsum.photos/seed/avatar/400/400"
                    }
                    alt={userInfo?.username || "Profile"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {userInfo?.relationship.self && (
                  <label
                    htmlFor="avatar-upload-quick"
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Camera size={18} />
                    <input
                      id="avatar-upload-quick"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left sm:pt-20">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-heading">
                  {userInfo?.username || "username"}
                </h1>
                {userInfo?.relationship.following && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <UserCheck size={12} />
                    Following
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-muted-foreground mb-4 max-w-md">
                {userInfo?.description || "No bio yet"}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {userInfo?.relationship.self ? (
                  <>
                    <button
                      className="px-5 py-2 bg-muted hover:bg-accent text-foreground font-medium text-sm rounded-xl transition-colors cursor-pointer"
                      onClick={() => setShowEditDialog(true)}
                    >
                      Edit profile
                    </button>
                    <button
                      onClick={() => setShowShareDialog(true)}
                      className="px-5 py-2 bg-muted hover:bg-accent text-foreground font-medium text-sm rounded-xl transition-colors cursor-pointer"
                    >
                      <Share2 size={16} className="inline mr-2" />
                      Share
                    </button>
                    <Link href="/settings">
                      <button className="p-2 bg-muted hover:bg-accent text-foreground rounded-xl transition-colors cursor-pointer">
                        <Settings size={18} />
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        handleAddFollow().then(() => getUserInfo(username))
                      }
                      className={`px-6 py-2 font-semibold text-sm rounded-xl transition-all cursor-pointer ${
                        userInfo?.relationship.following
                          ? "bg-muted hover:bg-accent text-foreground"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      }`}
                    >
                      {userInfo?.relationship.following ? (
                        <>
                          <UserCheck size={16} className="inline mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} className="inline mr-2" />
                          Follow
                        </>
                      )}
                    </button>
                    <Link href={`/message/${username}`}>
                      <button className="px-5 py-2 bg-muted hover:bg-accent text-foreground font-medium text-sm rounded-xl transition-colors cursor-pointer">
                        <Mail size={16} className="inline mr-2" />
                        Message
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center sm:justify-start gap-8 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.posts}</p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
            <button
              type="button"
              onClick={() => setShowFollowersDialog(true)}
              className="text-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <p className="text-2xl font-bold text-foreground">
                {stats.followers.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </button>
            <button
              type="button"
              onClick={() => setShowFollowingsDialog(true)}
              className="text-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              <p className="text-2xl font-bold text-foreground">
                {stats.following.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Following</p>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-border">
          <div className="flex justify-center">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 sm:px-8 py-4 text-sm font-medium border-t-2 -mt-px transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Grid */}
        <div className="py-6">
          {activeTab === "posts" && (
            <>
              {isUserLoading ? (
                <div className="grid grid-cols-3 gap-1 sm:gap-3">
                  {[...Array(9)].map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-muted/50 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : safeUserPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1 sm:gap-3">
                  {safeUserPosts.map((post) => (
                    <Link key={post.id} href={`/post/${post.id}`}>
                      <ProfilePostItem post={post} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Camera size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Posts Yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {userInfo?.relationship.self
                      ? "Share your first photo or video to start building your profile."
                      : "This user hasn't posted anything yet."}
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "saved" && (
            <div>
              {isSavedLoading ? (
                <div className="grid grid-cols-3 gap-1 sm:gap-3">
                  {[...Array(6)].map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-muted/50 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : isSavedError ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Bookmark size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Could not load saved posts
                  </h3>
                  <button
                    onClick={() => refetchSaved()}
                    className="px-6 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              ) : safeSavedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1 sm:gap-3">
                  {safeSavedPosts.map((post) => (
                    <Link key={`saved-${post.id}`} href={`/post/${post.id}`}>
                      <ProfilePostItem post={post} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Bookmark size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Saved Posts
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Save posts you want to see again. Only you can see what
                    you've saved.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "tagged" && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <UserCheck size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Photos of You
              </h3>
              <p className="text-sm text-muted-foreground">
                When people tag you in photos, they'll appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Share Profile Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md glass-card">
          <DialogTitle className="text-xl font-semibold text-center mb-4">
            Share Profile
          </DialogTitle>
          <div className="flex flex-col items-center gap-6 py-4">
            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl shadow-inner">
              {profileUrl && (
                <QRCodeSVG value={profileUrl} size={180} level="H" />
              )}
            </div>

            {/* Profile Link */}
            <div className="w-full">
              <label className="text-sm text-muted-foreground mb-2 block text-center">
                Profile Link
              </label>
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-2 border border-border">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-foreground outline-none px-2"
                />
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Followers Dialog */}
      <Dialog open={showFollowersDialog} onOpenChange={setShowFollowersDialog}>
        <DialogContent className="max-w-md glass-card">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Followers
          </DialogTitle>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin mt-4">
            {followersList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No followers yet
              </p>
            ) : (
              followersList.map((follower: any) => (
                <div
                  key={follower.id || follower.username}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors"
                >
                  <Link
                    href={`/profile/${follower.username}`}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <img
                      src={
                        follower.avatar ||
                        "https://picsum.photos/seed/avatar/100/100"
                      }
                      alt={follower.username}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <span className="text-sm font-medium text-foreground truncate">
                      {follower.username}
                    </span>
                  </Link>
                  {userInfo?.relationship.self && (
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                      onClick={() => {
                        handleAddFollow(follower.username).then(() =>
                          getUserInfo(username)
                        );
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Followings Dialog */}
      <Dialog
        open={showFollowingsDialog}
        onOpenChange={setShowFollowingsDialog}
      >
        <DialogContent className="max-w-md glass-card">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Following
          </DialogTitle>
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin mt-4">
            {followingsList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Not following anyone yet
              </p>
            ) : (
              followingsList.map((user: any) => (
                <div
                  key={user.id || user.username}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors"
                >
                  <Link
                    href={`/profile/${user.username}`}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <img
                      src={
                        user.avatar ||
                        "https://picsum.photos/seed/avatar/100/100"
                      }
                      alt={user.username}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <span className="text-sm font-medium text-foreground truncate">
                      {user.username}
                    </span>
                  </Link>
                  {userInfo?.relationship.self && (
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-medium text-foreground border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => {
                        handleAddFollow(user.username).then(() =>
                          getUserInfo(username)
                        );
                      }}
                    >
                      Following
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="overflow-auto max-h-[80vh] glass-card">
          <DialogTitle className="text-xl font-semibold">
            Edit Profile
          </DialogTitle>
          <form className="space-y-6 mt-4">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={
                    userInfo?.avatar ||
                    "https://picsum.photos/seed/avatar/400/400"
                  }
                  alt="Avatar preview"
                  className="rounded-full w-28 h-28 object-cover ring-4 ring-primary/20"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera size={16} />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Display Name
              </label>
              <input
                type="text"
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={editValues.displayName}
                onChange={(e) =>
                  setEditValues((v) => ({ ...v, displayName: e.target.value }))
                }
                placeholder="Your display name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bio
              </label>
              <textarea
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={4}
                value={editValues.bio}
                onChange={(e) =>
                  setEditValues((v) => ({ ...v, bio: e.target.value }))
                }
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditDialog(false)}
                className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
                onClick={handleEditProfile}
              >
                Save Changes
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

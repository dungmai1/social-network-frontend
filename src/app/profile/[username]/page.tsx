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
} from "lucide-react";
import useUser from "@/hooks/useUser";
import { usePost } from "@/hooks/usePost";
import { useLike } from "@/hooks/useLike";
import { useComment } from "@/hooks/useComment";
import { PostModel } from "@/types/post";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Post from "@/app/(home)/components/Post";
import useRelationship from "@/hooks/useRelationship";
import Header from "@/app/(home)/components/Header";
import QRCodeSVG from "react-qr-code";
function ProfilePostItem({ post }: { post: PostModel }) {
  const { likeCount } = useLike(post);
  const { commentCount } = useComment(post);
  return (
    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden group cursor-pointer relative">
      <img
        src={post.images?.[0]}
        alt="Post"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-6 text-white transition-opacity duration-200">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-sm font-semibold">{likeCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
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

  const [showDialog, setShowDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostModel | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editValues, setEditValues] = useState({
    displayName: userInfo?.username || "",
    bio: userInfo?.description || "",
  });
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingsDialog, setShowFollowingsDialog] = useState(false);

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
    console.log(followersList);
  }, [username]);

  const handleEditProfile = useCallback(async () => {
    try {
      // await getUserInfo(username, {
      //   displayName: editValues.displayName,
      //   bio: editValues.bio,
      //   website: editValues.website,
      // });
      setShowEditDialog(false);
      refetchUser(); // Refetch user info to update the header
    } catch (error) {
      console.error("Failed to edit profile", error);
    }
  }, [username, editValues, getUserInfo, refetchUser]);

  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      {/* Profile Header */}
      <Header />
      <div className="px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="flex justify-center md:justify-start">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={
                  userInfo?.avatar ||
                  "https://picsum.photos/seed/avatar/400/400"
                }
                alt={userInfo?.username || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            {/* Username and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h1 className="text-2xl font-light text-gray-900">
                {userInfo?.username || "username"}
              </h1>
              <div className="flex gap-2">
                {userInfo?.relationship.self ? (
                  <>
                    <button
                      className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-sm rounded-md transition"
                      onClick={() => setShowEditDialog(true)}
                    >
                      Edit profile
                    </button>
                    <button
                      onClick={() => setShowShareDialog(true)}
                      className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-sm rounded-md transition"
                    >
                      Share profile
                    </button>
                  </>
                ) : (
                  <>
                    {userInfo?.relationship.following ? (
                      <button
                        onClick={() =>
                          handleAddFollow().then(() => getUserInfo(username))
                        }
                        className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-sm rounded-md transition"
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleAddFollow().then(() => getUserInfo(username))
                        }
                        className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-sm rounded-md transition"
                      >
                        Follow
                      </button>
                    )}
                    <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-sm rounded-md transition">
                      Message
                    </button>
                  </>
                )}
                <button className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition">
                  <Settings size={16} />
                </button>
                <button className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 text-sm">
              <div>
                <span className="font-semibold text-gray-900">
                  {stats.posts}
                </span>
                <span className="text-gray-600 ml-1">posts</span>
              </div>
              <button
                type="button"
                onClick={() => setShowFollowersDialog(true)}
                className="flex items-center focus:outline-none"
              >
                <span className="font-semibold text-gray-900">
                  {stats.followers}
                </span>
                <span className="text-gray-600 ml-1">followers</span>
              </button>
              <button
                type="button"
                onClick={() => setShowFollowingsDialog(true)}
                className="flex items-center focus:outline-none"
              >
                <span className="font-semibold text-gray-900">
                  {stats.following}
                </span>
                <span className="text-gray-600 ml-1">following</span>
              </button>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <div className="font-semibold text-gray-900">
                {userInfo?.username || "Display Name"}
              </div>
              <div className="text-gray-900">
                {userInfo?.description || "No bio"}
              </div>
              <div className="text-blue-600 text-sm">
                <a href="#" className="hover:underline">
                  example.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-8 py-4 text-sm font-medium border-t-2 transition ${activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-4">
        {activeTab === "posts" && (
          <>
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {safeUserPosts.length > 0 ? (
                safeUserPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post);
                      setShowDialog(true);
                    }}
                  >
                    <ProfilePostItem post={post} />
                  </div>
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-500">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
                    <Grid3X3 size={24} />
                  </div>
                  <h3 className="text-xl font-light mb-2">No Posts Yet</h3>
                  <p className="text-sm">
                    When you share photos and videos, they'll appear on your
                    profile.
                  </p>
                </div>
              )}
            </div>
            {/* Popup chi tiết post */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent className="overflow-auto max-h-[80vh]">
                {selectedPost && (
                  <Post post={selectedPost} onSavePost={handleSavePost} />
                )}
              </DialogContent>
            </Dialog>
          </>
        )}

        {activeTab === "saved" && (
          <div>
            {isSavedLoading ? (
              <div className="grid grid-cols-3 gap-1 md:gap-4 animate-pulse">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-gray-100 rounded-lg"
                  />
                ))}
              </div>
            ) : isSavedError ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
                  <Bookmark size={24} />
                </div>
                <h3 className="text-xl font-light mb-2">
                  Không thể tải danh sách đã lưu
                </h3>
                <button
                  onClick={() => refetchSaved()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                >
                  Thử lại
                </button>
              </div>
            ) : safeSavedPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {safeSavedPosts.map((post) => (
                  <div
                    key={`saved-${post.id}`}
                    onClick={() => {
                      setSelectedPost(post);
                      setShowDialog(true);
                    }}
                    className="cursor-pointer"
                  >
                    <ProfilePostItem post={post} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
                  <Bookmark size={24} />
                </div>
                <h3 className="text-xl font-light mb-2">
                  Chưa có bài viết đã lưu
                </h3>
                <p className="text-sm text-center max-w-sm">
                  Các bài viết bạn lưu sẽ xuất hiện tại đây. Hãy khám phá và lưu
                  lại những nội dung bạn yêu thích.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "tagged" && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
              <UserCheck size={24} />
            </div>
            <h3 className="text-xl font-light mb-2">Photos of You</h3>
            <p className="text-sm">
              When people tag you in photos, they'll appear here.
            </p>
          </div>
        )}
      </div>

      {/* Share Profile Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-xl font-semibold text-center mb-4">
            Share Profile
          </DialogTitle>
          <div className="flex flex-col items-center gap-6 py-4">
            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              {profileUrl && (
                <QRCodeSVG value={profileUrl} size={200} level="H" />
              )}
            </div>

            {/* Profile Link */}
            <div className="w-full">
              <div className="text-sm text-gray-600 mb-2 text-center">
                Profile Link
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy</span>
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
        <DialogContent className="max-w-md">
          <DialogTitle className="text-lg font-semibold mb-4">
            Followers
          </DialogTitle>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {followersList.length === 0 ? (
              <p className="text-sm text-gray-500">No followers yet.</p>
            ) : (
              followersList.map((follower: any) => (
                <div
                  key={follower.id || follower.username}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        follower.avatar ||
                        "https://picsum.photos/seed/avatar/100/100"
                      }
                      alt={follower.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {follower.username}
                    </span>
                  </div>
                  {
                    userInfo?.relationship.self ?
                      <button
                        type="button"
                        className="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50"
                        onClick={() => {
                          handleAddFollow(follower.username).then(() =>
                            getUserInfo(username)
                          );
                        }}
                      >
                        Remove
                      </button>
                      : <></>
                  }
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
        <DialogContent className="max-w-md">
          <DialogTitle className="text-lg font-semibold mb-4">
            Following
          </DialogTitle>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {followingsList.length === 0 ? (
              <p className="text-sm text-gray-500">Not following anyone yet.</p>
            ) : (
              followingsList.map((user: any) => (
                <div
                  key={user.id || user.username}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.avatar || "https://picsum.photos/seed/avatar/100/100"
                      }
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {user.username}
                    </span>
                  </div>
                  {
                    userInfo?.relationship.self ?
                      <button
                        type="button"
                        className="px-3 py-1 text-xs font-medium text-gray-900 border border-gray-200 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          handleAddFollow(user.username).then(() =>
                            getUserInfo(username)
                          );
                        }}
                      >
                        Following
                      </button>
                      : <></>
                  }
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="overflow-auto max-h-[80vh]">
          <DialogTitle>Edit Profile</DialogTitle>
          <form className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24">
                <label htmlFor="avatar-upload" className="block">
                  <img
                    src={
                      userInfo?.avatar ||
                      "https://picsum.photos/seed/avatar/400/400"
                    }
                    alt="Avatar preview"
                    className="rounded-full w-24 h-24 object-cover border"
                  />
                </label>
                <Camera
                  size={22}
                  className="absolute bottom-0 right-0 text-gray-600 bg-white rounded-full p-1 border cursor-pointer"
                />
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
              <label className="block text-sm font-medium mb-1">
                Display Name
              </label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={editValues.displayName} // cần state editValues cho các giá trị
                onChange={(e) =>
                  setEditValues((v) => ({ ...v, displayName: e.target.value }))
                }
              />
            </div>
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                className="w-full border rounded-md px-3 py-2"
                value={editValues.bio}
                onChange={(e) =>
                  setEditValues((v) => ({ ...v, bio: e.target.value }))
                }
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditDialog(false)}
                className="px-4 py-2 rounded-md border"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleEditProfile}
              >
                Lưu
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

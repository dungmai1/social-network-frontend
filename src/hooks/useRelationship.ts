import {
  addFollow,
  recommendUser,
  getFollower,
  getFollowing,
} from "@/services/relationship.service";
import { UserModel } from "@/types/user";
import { useCallback, useEffect, useState } from "react";

export default function useRelationship(username?: string) {
  const [listRecommend, setListRecommend] = useState<UserModel[]>([]);
  const [isLoadingRecommend, setIsLoadingRecommend] = useState<boolean>(false);

  const [followersList, setFollowersList] = useState<UserModel[]>([]);
  const [followingsList, setFollowingsList] = useState<UserModel[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  const handleAddFollow = async (targetUsername?: string) => {
    const usernameToFollow = targetUsername || username;
    if (!usernameToFollow) return;
    try {
      await addFollow(usernameToFollow);
      if (targetUsername) {
        setFollowedUsers((prev) => [...prev, targetUsername]);
      }
    } catch (error) {
      console.log("Error add follow", error);
    }
  };

  const handleRecommendUser = useCallback(async () => {
    if (!username) {
      setListRecommend([]);
      return;
    }

    setIsLoadingRecommend(true);
    try {
      const res = await recommendUser(username);
      const normalized = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setListRecommend(normalized);
    } catch (error) {
      console.log("Error recommend user", error);
    } finally {
      setIsLoadingRecommend(false);
    }
  }, [username]);

  const fetchFollowersAndFollowings = useCallback(async () => {
    if (!username) {
      setFollowersList([]);
      setFollowingsList([]);
      return;
    }

    try {
      const [followersRes, followingsRes] = await Promise.all([
        getFollower(username),
        getFollowing(username),
      ]);

      const normalizedFollowers = Array.isArray(followersRes)
        ? followersRes
        : Array.isArray(followersRes?.data)
          ? followersRes.data
          : [];

      const normalizedFollowings = Array.isArray(followingsRes)
        ? followingsRes
        : Array.isArray(followingsRes?.data)
          ? followingsRes.data
          : [];

      setFollowersList(normalizedFollowers);
      setFollowingsList(normalizedFollowings);
    } catch (error) {
      console.log("Error fetch followers/followings", error);
    }
  }, [username]);

  useEffect(() => {
    handleRecommendUser();
  }, [handleRecommendUser]);

  useEffect(() => {
    fetchFollowersAndFollowings();
  }, [fetchFollowersAndFollowings]);

  return {
    handleAddFollow,
    listRecommend,
    isLoadingRecommend,
    handleRecommendUser,
    followersList,
    followingsList,
    followedUsers,
  };
}

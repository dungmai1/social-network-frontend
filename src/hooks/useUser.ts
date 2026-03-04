import { logout } from "@/services/auth.service";
import { getUser, getUserbyUsername } from "@/services/user.service";
import { UserModel, UserProfileModel } from "@/types/user";
import { useEffect, useState } from "react";

export default function useUser() {
  const [userCurrent, setUserCurrent] = useState<UserModel | null>(null);
  const [userInfo, setUserInfo] = useState<UserProfileModel | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingUser(true);
      const data = await getUser();
      if (data) {
        setUserCurrent(data);
      }
      setIsLoadingUser(false);
    };
    fetchData();
  }, []);

  const refreshUser = async () => {
    const data = await getUser();
    if (data) {
      setUserCurrent(data);
    }
  };

  const ClickLogout = async () => {
    await logout();
  };

  const getUserInfo = async (username: string) => {
    try {
      setIsLoadingUserInfo(true);
      const res = await getUserbyUsername(username);
      setUserInfo(res || null);
    } catch {
      console.log("Error get user by user name");
    } finally {
      setIsLoadingUserInfo(false);
    }
  };
  return { userCurrent, isLoadingUser, ClickLogout, getUserInfo, userInfo, isLoadingUserInfo, refreshUser };
}

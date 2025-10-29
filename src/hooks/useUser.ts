import { logout } from "@/services/auth.service";
import { getUser, getUserbyUsername } from "@/services/user.service";
import { UserModel, UserProfileModel } from "@/types/user";
import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState<UserModel | null>(null);
  const [userInfo, setUserInfo] = useState<UserProfileModel | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUser();
      if (data) {
        setUser(data);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const getUserInfo = async (username: string) => {
    try {
      const res = await getUserbyUsername(username);
      setUserInfo(res || null);
    } catch {
      console.log("Error get user by user name");
    }
  };
  return { user, handleLogout, getUserInfo, userInfo };
}

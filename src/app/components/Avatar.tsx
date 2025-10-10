"use client"
import { useEffect, useState } from "react";
import { getUser } from "../services/user.service";
import { UserModel } from "../types/user";

export default function Avatar() {
    const [user, setUser] = useState<UserModel | null>(null);
    useEffect(() => {
      const fetchData = async () => {
        const data = await getUser();
        if (data) {
          setUser(data);
        }
      };
      fetchData();
    }, []);
  return (
    <div className="bg-white p-3 rounded-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{user?.username}</div>
          <div className="text-xs text-gray-500">{user?.displayname}</div>
        </div>
        <img
          className="w-12 h-12 rounded-full"
          src={user?.avatar}
          alt="me"
        /> 
      </div>
    </div>
  );
}

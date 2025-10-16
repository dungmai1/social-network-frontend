import { logout } from "@/services/auth.service";
import { getUser } from "@/services/user.service";
import { UserModel } from "@/types/user";
import { useEffect, useState } from "react";

export default function useUser() {
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

    const handleLogout = async () => {
        await logout();
    };
    return { user, handleLogout }
}
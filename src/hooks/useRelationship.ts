import { addFollow, recommendUser } from "@/services/relationship.service";
import { UserModel } from "@/types/user";
import { useCallback, useEffect, useState } from "react";

export default function useRelationship(username?: string) {
    const [listRecommend, setListRecommend] = useState<UserModel[]>([]);
    const [isLoadingRecommend, setIsLoadingRecommend] = useState<boolean>(false);

    const handleAddFollow = async (targetUsername?: string) => {
        const usernameToFollow = targetUsername || username;
        if (!usernameToFollow) return;
        try {
            await addFollow(usernameToFollow);
            if (targetUsername) {
                setListRecommend((prev) =>
                    prev.filter((user) => user.username !== targetUsername)
                );
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

    useEffect(() => {
        handleRecommendUser();
    }, [handleRecommendUser]);

    return { handleAddFollow, listRecommend, isLoadingRecommend, handleRecommendUser };
}

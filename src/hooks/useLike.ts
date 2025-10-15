import { addLike, getLikePost } from "@/services/like.service";
import { PostModel } from "@/types/post";
import { useEffect, useState } from "react";

export function useLike(post: PostModel) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const handleLikeToggle = async () => {
        try {
            const res = await getLikePost(post.id);
            if (!res) return;
            setIsLiked(res.liked);
            setLikeCount(res.likeCount ?? 0);
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };
    const handleClickLike = async (postId: number) => {
        try {
            const res = await addLike("postId", postId, "post");
            if (res) {
                setIsLiked((p) => !p);
                setLikeCount((c) => c + (isLiked ? -1 : 1));
            }
        } catch (error) {
            console.log("Error click like");
        }
    };
    useEffect(() => {
        handleLikeToggle();
    }, []);
    return { isLiked, likeCount, handleClickLike }
}
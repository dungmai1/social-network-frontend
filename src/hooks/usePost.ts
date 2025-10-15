import { getAllPost } from "@/services/post.service";
import { PostModel } from "@/types/post";
import { useEffect, useState } from "react";

export function usePost() {
    const [postLists, setPostLists] = useState<PostModel[]>([]);
    const fetchDataPost = async () => {
        const data = await getAllPost();
        if (data) {
            setPostLists(data);
        }
    };
    useEffect(() => {
        fetchDataPost();
    }, []);
    return { postLists }
}
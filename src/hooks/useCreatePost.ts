"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/services/post.service";

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => createPost(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}


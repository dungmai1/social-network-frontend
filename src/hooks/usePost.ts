import {
  getAllPost,
  getAllPostByUsername,
  getSavedPostsByUsername,
  savePost as savePostRequest,
} from "@/services/post.service";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function usePost(username?: string) {
  const queryClient = useQueryClient();
  const allPostsQuery = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = "" }) => getAllPost(pageParam),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled: !username,
  });

  const postsByUserQuery = useQuery({
    queryKey: ["posts", "byUser", username],
    queryFn: () => getAllPostByUsername(username),
    enabled: !!username,
  });

  const savedPostsByUserQuery = useQuery({
    queryKey: ["posts", "saved", username],
    queryFn: () => getSavedPostsByUsername(username),
    enabled: !!username,
  });

  const savePostMutation = useMutation({
    mutationFn: (postId: number) => savePostRequest(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "saved", username] });
    },
  });

  return {
    allPostsQuery,
    postsByUserQuery,
    savedPostsByUserQuery,
    savePostMutation,
  };
}

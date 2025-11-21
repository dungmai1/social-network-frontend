import { getAllPost, getAllPostByUsername } from "@/services/post.service";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function usePost(username?: string) {
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

  return {
    allPostsQuery,
    postsByUserQuery,
  };
}

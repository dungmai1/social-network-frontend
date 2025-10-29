import { getAllPost, getAllPostByUsername } from "@/services/post.service";
import { useQuery } from "@tanstack/react-query";

export function usePost(username?:string) {
  const allPostsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPost,
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

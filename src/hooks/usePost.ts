import { getAllPost, getAllPostByUsername } from "@/services/post.service";
import { useQuery } from "@tanstack/react-query";

export function usePost(username?:string) {
  //   const [postLists, setPostLists] = useState<PostModel[]>([]);
  //   const fetchDataPost = async () => {
  //     const data = await getAllPost();
  //     if (data) {
  //       setPostLists(data);
  //     }
  //   };


  const allPostsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPost,
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

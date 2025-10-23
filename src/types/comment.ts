export interface CommentModel {
  id: number;
  content: string;
  postId: number;
  username: string;
  userAvatar: string;
  imageUrl: string;
  commentTime: string;
}
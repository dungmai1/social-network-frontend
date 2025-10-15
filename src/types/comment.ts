export interface CommentModel {
  id: number;
  content: string;
  postId: number;
  userDisplayname: string;
  userAvatar: string;
  imageUrl: string;
  commentTime: string;
}
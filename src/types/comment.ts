export interface CommentModel {
  id: number;
  content: string;
  postId: number;
  username: string;
  userAvatar: string;
  imageUrl: string;
  commentTime: string;
  parentId: number;
}
export interface CommentRequest {
  postId: number;
  contentCmt: string;
  // imageUrl: String;
}
export interface RepliesRequest {
  commentId: number;
  content: string;
  // imageUrl: String;
}
// types/user.ts
export interface PostModel {
  id: number;
  content: string;
  postTime: string;
  username: string;
  avatar: string;
  status: string;
  images: string[];
  saved: boolean;
}

export interface PostResponse {
  data: PostModel[];
  nextCursor: string | null;
}
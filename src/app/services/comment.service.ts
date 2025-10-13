import { apiFetch } from "../(libs)/api";
import { CommentModel } from "../types/comment";

const URL_BASE = "/comments"

export interface CommentRequest{
  postId: String;
  contentCmt: String;
  imageUrl: String;
}
export async function getAllComment(postId: number) {
    const res = await apiFetch(`${URL_BASE}/posts?postId=${postId}`, { method: "GET" });
    if (!res.ok) {
      console.error("Error fetch Post");
      return;
    }
    const data: CommentModel[] = await res.json();
    return data;
}

export async function getCountComments(postId: number) {
    const res = await apiFetch(`${URL_BASE}/count?postId=${postId}`, { method: "GET" });
    if (!res.ok) {
      console.error("Error fetch Post");
      return;
    }
    const count = await res.json();
    return count;
}

export async function addComment() {

}


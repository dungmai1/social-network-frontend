import { apiFetch } from "../(libs)/api";
import { CommentModel } from "../types/comment";

const URL_BASE = "/comments"

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

export async function addComment(commentRequest: CommentRequest) {
  const res = await apiFetch(`${URL_BASE}/create`, { method: "POST", body: JSON.stringify(commentRequest) });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data: CommentModel[] = await res.json();
  return data;
}

export async function getCountRepliesComments(commentId: number) {
  const res = await apiFetch(`${URL_BASE}/replies/count?commentId=${commentId}`, { method: "GET" });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const count = await res.json();
  return count;
}

export async function getAllRepliesComments(commentId: number) {
  const res = await apiFetch(`${URL_BASE}/replies?commentId=${commentId}`, { method: "GET" });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const count = await res.json();
  return count;
}

export async function addReplies(repliesRequest: RepliesRequest) {
  const res = await apiFetch(`${URL_BASE}/replies/create`, { method: "POST", body: JSON.stringify(addReplies) });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data: RepliesRequest[] = await res.json();
  return data;
}

export async function deleteComment(postId: number, commentId: number) {
  const res = await apiFetch(`${URL_BASE}/delete?postId=${postId}?commentId=${commentId}`, { method: "DELETE" });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data = await res.json();
  return data;
}


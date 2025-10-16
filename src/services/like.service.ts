import { apiFetch } from "../lib/api";

const URL_BASE = "/likes"
export async function addLike(param: string, id: number, targetType: String) {
  const res = await apiFetch(`${URL_BASE}/${targetType}/add?${param}=${id}`, {
    method: "POST"
  });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data = await res.json();
  return data;
}

export async function getLikePost(postId: number) {
  const res = await apiFetch(`${URL_BASE}/post/count?postId=${postId}`, {
    method: "GET"
  });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data = await res.json();
  return data;
}

export async function getCommentLikeInfo(commentId: number) {
  const res = await apiFetch(`${URL_BASE}/comment/count?commentId=${commentId}`, {
    method: "GET"
  });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data = await res.json();
  return data;
}
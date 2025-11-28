import { apiFetch } from "../lib/api";
import { PostModel, PostResponse } from "../types/post";

const URL_BASE = "/post";

export async function getAllPost(cursor: string) {
  const res = await apiFetch(`${URL_BASE}/GetAllPost?cursor=${cursor}`, { method: "GET" });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data: PostResponse = await res.json();
  return data;
}

export async function getAllPostByUsername(username?: string) {
  const res = await apiFetch(`${URL_BASE}/GetAllPostByUsername/${username}`, { method: "GET" });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data: PostModel[] = await res.json();
  return data;
}

export async function getSavedPostsByUsername(username?: string) {
  const res = await apiFetch(`${URL_BASE}/GetAllSavedPostByUsername?username=${username}`, { method: "GET" });
  if (!res.ok) {
    console.error("Error fetch saved Post");
    return;
  }
  const data: PostModel[] = await res.json();
  return data;
}

export async function createPost(formData: FormData) {
  const res = await apiFetch(`${URL_BASE}/create`, { method: "POST", body: formData });
  if (!res.ok) {
    console.error("Error create Post");
    throw new Error("Create post failed");
  }
  const data: PostModel = await res.json();
  return data;
}

export async function savePost(postId: number) {
  const res = await apiFetch(`${URL_BASE}/save?postId=${postId}`, { method: "POST" });
  if (!res.ok) {
    console.error("Error create Post");
    throw new Error("Create post failed");
  }
  const data = await res.json();
  return data;
}

import { apiFetch } from "../lib/api";
import { PostModel } from "../types/post";

const URL_BASE = "/post"
export async function getAllPost() {
  const res = await apiFetch(`${URL_BASE}/GetAllPost`, { method: "GET" });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data: PostModel[] = await res.json();
  return data;
}

export async function getAllPostByUsername(username?:string) {
  const res = await apiFetch(`${URL_BASE}/GetAllPostByUsername/${username}`, { method: "GET" });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data: PostModel[] = await res.json();
  return data;
}

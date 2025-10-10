import { apiFetch } from "../(libs)/api";
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

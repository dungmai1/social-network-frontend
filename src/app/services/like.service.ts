import { apiFetch } from "../(libs)/api";

const URL_BASE = "/likes"
export async function addLike(postId:any) {
    const res = await apiFetch(`${URL_BASE}/add?postId=${postId}`, { 
        method: "POST"     });
    if (!res.ok) {
      console.error("Error fetch Post");
      return;
    }
    const data = await res.json();
    return data;
}

export async function getLike(postId:any) {
    const res = await apiFetch(`${URL_BASE}/post/count?postId=${postId}`, { 
        method: "GET"     });
    if (!res.ok) {
      console.error("Error fetch Post");
      return;
    }
    const data = await res.json();
    return data;
}

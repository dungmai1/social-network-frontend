import { apiFetch } from "../lib/api";

const URL_BASE = "/relationship"
export async function addFollow(username: string) {
    const res = await apiFetch(`${URL_BASE}/addFollow/${username}`, { method: "POST" });
    if (!res.ok) {
        console.error("Error fetch Post");
        return;
    }
    const data = await res.json();
    return data;
}



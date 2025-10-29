import { apiFetch } from "../lib/api";

const URL_BASE = "/relationship"
export async function getCountFollowing(username: string) {
    const res = await apiFetch(`${URL_BASE}/count/following/${username}`, { method: "GET" });
    if (!res.ok) {
        console.error("Error fetch Post");
        return;
    }
    const data = await res.json();
    return data;
}

export async function getCountFollower(username: string) {
    const res = await apiFetch(`${URL_BASE}/count/followers/${username}`, { method: "GET" });
    if (!res.ok) {
        console.error("Error fetch Post");
        return;
    }
    const data = await res.json();
    return data;
}


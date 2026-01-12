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

export async function recommendUser(username: string) {
    const res = await apiFetch(`${URL_BASE}/recommend?username=${username}`, { method: "GET" });
    if (!res.ok) {
        console.error("Error fetch Post");
        return;
    }
    const data = await res.json();
    return data;
}
export async function getFollower(username: string) {
    const res = await apiFetch(`${URL_BASE}/followers/${username}`, { method: "GET" });
    if (!res.ok) {
        console.error("Error fetch Post");
        return;
    }
    const data = await res.json();
    return data;
}
export async function getFollowing(username: string) {
    const res = await apiFetch(`${URL_BASE}/following/${username}`, { method: "GET" });
    if (!res.ok) {
        console.error("Error fetch Post");
        return;
    }
    const data = await res.json();
    return data;
}



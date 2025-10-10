import { apiFetch } from "../(libs)/api";

const URL_BASE = "/user"
export async function getUser() {
    const res = await apiFetch(`${URL_BASE}`, { method: "GET" });
    if (!res.ok) {
      console.error("Error fetch Post");
      return;
    }
    const data = await res.json();
    return data;
}

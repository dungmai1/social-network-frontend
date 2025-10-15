import { apiFetch } from "@/lib/api";

const URL_AUTH = "http://localhost:8080/api/v1/auth";
export async function login(username: string, password: string) {
    const res = await fetch(`${URL_AUTH}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
        throw new Error("Invalid credentials");
    } else {
        const data = await res.json();
        window.location.href = "/home"
        return data;
    }
}

export async function logout() {
    const res = await apiFetch(`/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
    })
    if (!res.ok) {
        throw new Error("Failed to logout");
    }
    window.location.href = "/login";
}

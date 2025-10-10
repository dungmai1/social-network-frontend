import { apiFetch } from "@/app/(libs)/api";

const URL_AUTH = "http://localhost:8080/api/v1/auth";
export async function login(username: string, password: string) {
    const res = await fetch(`${URL_AUTH}/login`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    })
    if(!res.ok){
        throw new Error("Invalid credentials");
    }else{
        const data = await res.json();
        window.location.href = "/home"
        return data;
    }
}

export async function logout() {
}

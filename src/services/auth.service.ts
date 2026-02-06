import { apiFetch } from "@/lib/api";

const URL_AUTH = "http://localhost:8080/api/v1/auth";
export async function login(username: string, password: string) {
  const res = await fetch(`${URL_AUTH}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Login failed");
  } else {
    const data = await res.json();
    return data;
  }
}

export async function logout() {
  const res = await apiFetch(`/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to logout");
  }
  window.location.href = "/login";
}
export async function register(
  username: string,
  displayname: string,
  email: string,
  password: string,
) {
  const res = await fetch(`${URL_AUTH}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, displayname, email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Registration failed");
  } else {
    const data = await res.json();
    window.location.href = "/login";
    return data;
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const res = await apiFetch(`/api/v1/auth/change-password`, {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to change password");
  }
  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${URL_AUTH}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to send reset link");
  }
  return res.json();
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${URL_AUTH}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to reset password");
  }
  return res.json();
}

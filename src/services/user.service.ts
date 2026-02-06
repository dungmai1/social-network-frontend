import { apiFetch } from "../lib/api";

const URL_BASE = "/user";
export async function getUser() {
  const res = await apiFetch(`${URL_BASE}`, { method: "GET" });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data = await res.json();
  return data;
}

export async function getUserbyUsername(username: string) {
  const res = await apiFetch(`${URL_BASE}/${username}`, { method: "GET" });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data = await res.json();
  return data;
}

export async function searchUsers(textSearch: string) {
  const res = await apiFetch(
    `${URL_BASE}/search?textSearch=${encodeURIComponent(textSearch)}`,
    {
      method: "GET",
    },
  );
  if (!res.ok) {
    console.error("Error searching users");
    return [];
  }
  const data = await res.json();
  return data;
}

export async function updateUser(formData: FormData) {
  const res = await apiFetch(`${URL_BASE}/updateUser`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update user profile");
  }

  const data = await res.json();
  return data;
}

import { apiFetch } from "../lib/api";
import { PostModel, PostResponse } from "../types/post";

const URL_BASE = "/post";

export async function getAllPost(cursor: string) {
  try {
    const res = await apiFetch(`${URL_BASE}/GetAllPost?cursor=${cursor}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: PostResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function getAllPostByUsername(username?: string) {
  if (!username) {
    throw new Error("Username is required");
  }
  try {
    const res = await apiFetch(`${URL_BASE}/GetAllPostByUsername/${username}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }
    const data: PostModel[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}

export async function getSavedPostsByUsername(username?: string) {
  if (!username) {
    throw new Error("Username is required");
  }
  try {
    const res = await apiFetch(
      `${URL_BASE}/GetAllSavedPostByUsername?username=${username}`,
      { method: "GET" }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch saved posts: ${res.status}`);
    }
    const data: PostModel[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    throw error;
  }
}

export async function createPost(formData: FormData) {
  try {
    const res = await apiFetch(`${URL_BASE}/create`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`Failed to create post: ${res.status}`);
    }
    const data: PostModel = await res.json();
    return data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function savePost(postId: number) {
  if (!postId) {
    throw new Error("Post ID is required");
  }
  try {
    const res = await apiFetch(`${URL_BASE}/save?postId=${postId}`, {
      method: "POST",
    });
    if (!res.ok) {
      throw new Error(`Failed to save post: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
}

export async function deletePost(postId: number) {
  if (!postId) {
    throw new Error("Post ID is required");
  }
  try {
    const res = await apiFetch(`${URL_BASE}/delete?postId=${postId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Failed to delete post: ${res.status}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export async function updatePost(postId: number, content: string) {
  if (!postId) {
    throw new Error("Post ID is required");
  }
  try {
    const res = await apiFetch(`${URL_BASE}/updatePost?postId=${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update post: ${res.status}`);
    }
    const data: PostModel = await res.json();
    console.log("Update post API response:", data);
    return data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

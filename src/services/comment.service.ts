import { apiFetch } from "../lib/api";
import {
  CommentModel,
  CommentRequest,
  RepliesRequest,
  EditCommentRequest,
} from "../types/comment";

const URL_BASE = "/comments";

export async function getAllComment(postId: number) {
  const res = await apiFetch(`${URL_BASE}/posts?postId=${postId}`, {
    method: "GET",
  });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const comments: CommentModel[] = await res.json();
  return comments;
}

export async function getCountComments(postId: number) {
  const res = await apiFetch(`${URL_BASE}/count?postId=${postId}`, {
    method: "GET",
  });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const countComment = await res.json();
  return countComment;
}

export async function addComment(commentRequest: CommentRequest) {
  const res = await apiFetch(`${URL_BASE}/create`, {
    method: "POST",
    body: JSON.stringify(commentRequest),
  });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data: CommentModel[] = await res.json();
  return data;
}

export async function getCountRepliesComments(commentId: number) {
  const res = await apiFetch(
    `${URL_BASE}/replies/count?commentId=${commentId}`,
    { method: "GET" },
  );
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const countReplies = await res.json();
  return countReplies;
}

export async function getAllRepliesComments(commentId: number) {
  const res = await apiFetch(`${URL_BASE}/replies?commentId=${commentId}`, {
    method: "GET",
  });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const replies = await res.json();
  return replies;
}

export async function addReplies(repliesRequest: RepliesRequest) {
  const res = await apiFetch(`${URL_BASE}/replies/create`, {
    method: "POST",
    body: JSON.stringify(repliesRequest),
  });
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data: CommentModel[] = await res.json();
  return data;
}

export async function deleteComment(postId: number, commentId: number) {
  const res = await apiFetch(
    `${URL_BASE}/delete?postId=${postId}&commentId=${commentId}`,
    { method: "DELETE" },
  );
  if (!res.ok) {
    console.error("Error fetch Post");
    return;
  }
  const data = await res.json();
  return data;
}

export async function editComment(editRequest: EditCommentRequest) {
  const res = await apiFetch(`${URL_BASE}/edit`, {
    method: "PUT",
    body: JSON.stringify(editRequest),
  });
  if (!res.ok) {
    console.error("Error editing comment");
    return;
  }
  const data: CommentModel = await res.json();
  return data;
}

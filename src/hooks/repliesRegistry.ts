// src/hooks/repliesRegistry.ts
type AppendFn = (reply: import("@/types/comment").CommentModel) => void;
const map = new Map<number, AppendFn>();
export const registerRepliesAppender = (id: number, fn: AppendFn) => map.set(id, fn);
export const unregisterRepliesAppender = (id: number) => map.delete(id);
export const appendReplyById = (id: number, r: import("@/types/comment").CommentModel) => map.get(id)?.(r);
"use client";
import { createContext, useContext } from "react";

interface CommentActionsContextValue {
    handleDeleteComment: (postId: number, commentId: number) => Promise<void>;
}

const CommentActionsContext = createContext<CommentActionsContextValue | null>(null);

export function CommentActionsProvider({ value, children }: { value: CommentActionsContextValue; children: React.ReactNode }) {
    return <CommentActionsContext.Provider value={value}>{children}</CommentActionsContext.Provider>;
}

export function useCommentActions(): CommentActionsContextValue {
    const ctx = useContext(CommentActionsContext);
    if (!ctx) {
        throw new Error("useCommentActions must be used within a CommentActionsProvider");
    }
    return ctx;
}



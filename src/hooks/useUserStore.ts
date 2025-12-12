import { create } from "zustand";
import { CometChat } from "@cometchat/chat-sdk-javascript";

interface UserState {
  user: CometChat.User | null;
  setUser: (u: CometChat.User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
}));

"use client";

import { useEffect, useState } from "react";
import {
  Call,
  Conversation,
  Group,
  User,
  CometChat
} from "@cometchat/chat-sdk-javascript";

import {
  CometChatCallLogs,
  CometChatConversations,
  CometChatGroups,
  CometChatUIKit,
  CometChatUIKitLoginListener,
  CometChatUsers
} from "@cometchat/chat-uikit-react";
import { CometChatTabs } from "@/CometChat/CometChatTabs/CometChatTabs";

// Define props interface for selector
interface SelectorProps {
  onSelectorItemClicked?: (input: User | Group | Conversation | Call, type: string) => void;
}

export const CometChatSelector = (props: SelectorProps) => {
  const {
    onSelectorItemClicked = () => {},
  } = props;

  // State to manage currently logged in user
  const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>();

  // State to track selected conversation, user, group, or call
  const [activeItem, setActiveItem] = useState<
    Conversation | User | Group | Call | undefined
  >();

  // State to track currently active tab: "chats", "calls", "users", or "groups"
  const [activeTab, setActiveTab] = useState<string>("chats");

  // Fetch logged-in user once component mounts
  useEffect(() => {
    const user = CometChatUIKitLoginListener.getLoggedInUser();
    setLoggedInUser(user);
  }, [CometChatUIKitLoginListener?.getLoggedInUser()]);

  // Logout function to clear user session
  const logOut = () => {
    CometChatUIKit.logout()
      .then(() => {
        setLoggedInUser(null);
      })
      .catch((error) => {
        console.log("Logout error:", error);
      });
  };

  return (
    <>
      {/* Render selector content only if a user is logged in */}
      {loggedInUser && (
        <>
          {activeTab === "chats" && (
            <CometChatConversations
              activeConversation={activeItem instanceof CometChat.Conversation ? activeItem : undefined}
              onItemClick={(item) => {
                setActiveItem(item);
                onSelectorItemClicked(item, "updateSelectedItem");
              }}
            />
          )}

          {activeTab === "calls" && (
            <CometChatCallLogs
              activeCall={activeItem as Call}
              onItemClick={(item: Call) => {
                setActiveItem(item);
                onSelectorItemClicked(item, "updateSelectedItemCall");
              }}
            />
          )}

          {activeTab === "users" && (
            <CometChatUsers
              activeUser={activeItem as User}
              onItemClick={(item) => {
                setActiveItem(item);
                onSelectorItemClicked(item, "updateSelectedItemUser");
              }}
            />
          )}

          {activeTab === "groups" && (
            <CometChatGroups
              activeGroup={activeItem as Group}
              onItemClick={(item) => {
                setActiveItem(item);
                onSelectorItemClicked(item, "updateSelectedItemGroup");
              }}
            />
          )}
        </>
      )}

      {/* Render the tab switcher at the bottom */}
      <CometChatTabs
        activeTab={activeTab}
        onTabClicked={(item) => {
          setActiveTab(item.name.toLowerCase()); // Update tab on click
        }}
      />
    </>
  );
};
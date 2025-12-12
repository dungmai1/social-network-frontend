import React, { useEffect, useState } from "react";
import {
  CometChatMessageComposer,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatUIKit,
  UIKitSettingsBuilder,
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import "./CometChatNoSSR.css";
import { CometChatSelector } from "@/app/CometChatSelector/CometChatSelector";
import useUser from "@/hooks/useUser";
import { useUserStore } from "@/hooks/useUserStore";

// Constants for CometChat configuration
const COMETCHAT_CONSTANTS = {
  APP_ID: process.env.NEXT_PUBLIC_COMETCHAT_APP_ID ?? "",
  REGION: process.env.NEXT_PUBLIC_COMETCHAT_REGION ?? "",
  AUTH_KEY: process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY ?? "",
};

const CometChatNoSSR: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const [selectedUser, setSelectedUser] = useState<CometChat.User | undefined>(
    undefined
  );
  const [selectedGroup, setSelectedGroup] = useState<
    CometChat.Group | undefined
  >(undefined);

  return user ? (
    <div className="conversations-with-messages">
      {/* Sidebar with conversation list */}
      <div className="conversations-wrapper">
        <CometChatSelector
          onSelectorItemClicked={(activeItem) => {
            let item = activeItem;
            // Extract the conversation participant
            if (activeItem instanceof CometChat.Conversation) {
              item = activeItem.getConversationWith();
            }
            // Update states based on the type of selected item
            if (item instanceof CometChat.User) {
              setSelectedUser(item as CometChat.User);
              setSelectedGroup(undefined);
            } else if (item instanceof CometChat.Group) {
              setSelectedUser(undefined);
              setSelectedGroup(item as CometChat.Group);
            } else {
              setSelectedUser(undefined);
              setSelectedGroup(undefined);
            }
          }}
        />
      </div>

      {/* Message view section */}
      {selectedUser || selectedGroup ? (
        <div className="messages-wrapper">
          <CometChatMessageHeader user={selectedUser} group={selectedGroup} />
          <CometChatMessageList user={selectedUser} group={selectedGroup} />
          <CometChatMessageComposer user={selectedUser} group={selectedGroup} />
        </div>
      ) : (
        <div className="empty-conversation">Select Conversation to start</div>
      )}
    </div>
  ) : undefined;
};

export default CometChatNoSSR;

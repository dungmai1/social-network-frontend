"use client";

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
import "../CometChatTheme.css";
import { CometChatSelector } from "@/CometChat/CometChatSelector/CometChatSelector";
import { useUserStore } from "@/hooks/useUserStore";
import useUser from "@/hooks/useUser";
import { MessageSquare, Users, Sparkles } from "lucide-react";

// Constants for CometChat configuration
const COMETCHAT_CONSTANTS = {
  APP_ID: process.env.NEXT_PUBLIC_COMETCHAT_APP_ID ?? "",
  REGION: process.env.NEXT_PUBLIC_COMETCHAT_REGION ?? "",
  AUTH_KEY: process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY ?? "",
};

interface CometChatNoSSRProps {
  initialUsername?: string;
}

const CometChatNoSSR: React.FC<CometChatNoSSRProps> = ({ initialUsername }) => {
  const user = useUserStore((state) => state.user);
  const { userCurrent } = useUser();
  const [selectedUser, setSelectedUser] = useState<CometChat.User | undefined>(
    undefined,
  );
  const setUser = useUserStore.getState().setUser;
  const [selectedGroup, setSelectedGroup] = useState<
    CometChat.Group | undefined
  >(undefined);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConversations, setShowConversations] = useState(true);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 480);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    const initializeCometChat = async () => {
      if (!userCurrent?.username) return;

      try {
        const UIKitSettings = new UIKitSettingsBuilder()
          .setAppId(COMETCHAT_CONSTANTS.APP_ID)
          .setRegion(COMETCHAT_CONSTANTS.REGION)
          .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
          .subscribePresenceForAllUsers()
          .build();
        await CometChatUIKit.init(UIKitSettings);
        const user = await CometChatUIKit.login(userCurrent.username);
        console.log("Login Successful", { user });
        setUser(user);
        console.log("CometChat initialized successfully");
      } catch (error) {
        console.error("CometChat initialization failed:", error);
      }
    };
    if (!user && userCurrent?.username) {
      initializeCometChat();
    }
    if (initialUsername) {
      CometChat.getUser(initialUsername).then((user) => {
        setSelectedUser(user);
        setSelectedGroup(undefined);
        if (isMobileView) {
          setShowConversations(false);
        }
      });
    }
  }, [user, userCurrent, initialUsername, isMobileView]);

  const handleBackToConversations = () => {
    setShowConversations(true);
    setSelectedUser(undefined);
    setSelectedGroup(undefined);
  };

  return user ? (
    <div className="conversations-with-messages">
      {/* Sidebar with conversation list */}
      <div className={`conversations-wrapper ${isMobileView && !showConversations ? '' : 'active'}`}>
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
              window.history.pushState(null, "", `/message/${item.getUid()}`);
              if (isMobileView) {
                setShowConversations(false);
              }
            } else if (item instanceof CometChat.Group) {
              setSelectedUser(undefined);
              setSelectedGroup(item as CometChat.Group);
              if (isMobileView) {
                setShowConversations(false);
              }
            } else {
              setSelectedUser(undefined);
              setSelectedGroup(undefined);
            }
          }}
        />
      </div>

      {/* Message view section */}
      {selectedUser || selectedGroup ? (
        <div className={`messages-wrapper ${isMobileView && showConversations ? 'hidden' : ''}`}>
          <CometChatMessageHeader 
            user={selectedUser} 
            group={selectedGroup}
            onBack={isMobileView ? handleBackToConversations : undefined}
          />
          <CometChatMessageList user={selectedUser} group={selectedGroup} />
          <CometChatMessageComposer user={selectedUser} group={selectedGroup} />
        </div>
      ) : (
        <div className="empty-conversation">
          <div className="empty-conversation-icon">
            <MessageSquare />
          </div>
          <h3 className="empty-conversation-title">Start a Conversation</h3>
          <p className="empty-conversation-subtitle">
            Select a chat or find someone to message
          </p>
        </div>
      )}
    </div>
  ) : null;
};

export default CometChatNoSSR;

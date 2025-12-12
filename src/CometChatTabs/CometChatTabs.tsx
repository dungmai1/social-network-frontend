import { useState } from "react";
import "./CometChatTabs.css";

// Define icon paths for each tab
const chatsIcon = "/assets/chats.svg";
const callsIcon = "/assets/calls.svg";
const usersIcon = "/assets/users.svg";
const groupsIcon = "/assets/groups.svg";

// CometChatTabs component to display tab options
export const CometChatTabs = (props: {
  onTabClicked?: (tabItem: { name: string; icon?: string }) => void; // Callback when a tab is clicked
  activeTab?: string; // Name of the currently active tab
}) => {
  // Destructure props with default fallback
  const {
    onTabClicked = () => {}, // Fallback to no-op if not provided
    activeTab,
  } = props;

  // State to track the currently hovered tab
  const [hoverTab, setHoverTab] = useState("");

  // Array of tab items with their labels and icons
  const tabItems = [
    { name: "CHATS", icon: chatsIcon },
    { name: "CALLS", icon: callsIcon },
    { name: "USERS", icon: usersIcon },
    { name: "GROUPS", icon: groupsIcon },
  ];

  return (
    <div className="cometchat-tab-component">
      {/* Loop through each tab item to render it */}
      {tabItems.map((tabItem) => {
        const isActive =
          activeTab === tabItem.name.toLowerCase() ||
          hoverTab === tabItem.name.toLowerCase();

        return (
          <div
            key={tabItem.name}
            className="cometchat-tab-component__tab"
            onClick={() => onTabClicked(tabItem)} // Invoke callback on click
          >
            {/* Icon section with mask styling */}
            <div
              className={
                isActive
                  ? "cometchat-tab-component__tab-icon cometchat-tab-component__tab-icon-active"
                  : "cometchat-tab-component__tab-icon"
              }
              style={{
                WebkitMaskImage: `url(${tabItem.icon})`,
                maskImage: `url(${tabItem.icon})`,
              }}
              onMouseEnter={() => setHoverTab(tabItem.name.toLowerCase())}
              onMouseLeave={() => setHoverTab("")}
            />

            {/* Tab label */}
            <div
              className={
                isActive
                  ? "cometchat-tab-component__tab-text cometchat-tab-component__tab-text-active"
                  : "cometchat-tab-component__tab-text"
              }
              onMouseEnter={() => setHoverTab(tabItem.name.toLowerCase())}
              onMouseLeave={() => setHoverTab("")}
            >
              {tabItem.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

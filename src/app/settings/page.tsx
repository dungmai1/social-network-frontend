"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  Lock,
  Shield,
  Palette,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  AtSign,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import useUser from "@/hooks/useUser";
import Header from "@/components/layout/Header";

type SettingsTab =
  | "account"
  | "notifications"
  | "privacy"
  | "security"
  | "appearance"
  | "language"
  | "help";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { userCurrent } = useUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [accountForm, setAccountForm] = useState({
    username: userCurrent?.username || "",
    email: "",
    phone: "",
    displayName: userCurrent?.displayname || "",
    bio: "",
    website: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true,
    stories: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: false,
    showActivityStatus: true,
    showReadReceipts: true,
    allowTagging: true,
    allowMentions: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
  });

  const handleLogOut = async () => {
    try {
      const { CometChatUIKit } = await import("@cometchat/chat-uikit-react");
      await CometChatUIKit.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };

  const menuItems = [
    { id: "account" as const, label: "Account", icon: User },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "privacy" as const, label: "Privacy", icon: Eye },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
    { id: "language" as const, label: "Language", icon: Globe },
    { id: "help" as const, label: "Help & Support", icon: HelpCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Account Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your account information and profile details.
              </p>
            </div>

            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20">
                  <img
                    src={
                      userCurrent?.avatar ||
                      `https://picsum.photos/seed/${userCurrent?.username}/200`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                  <Camera size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={() => {}}
                  />
                </label>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {userCurrent?.username}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Change your profile photo
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <AtSign
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      value={accountForm.username}
                      onChange={(e) =>
                        setAccountForm({ ...accountForm, username: e.target.value })
                      }
                      className="w-full bg-muted/50 border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="username"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={accountForm.displayName}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, displayName: e.target.value })
                    }
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your display name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="email"
                    value={accountForm.email}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, email: e.target.value })
                    }
                    className="w-full bg-muted/50 border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="tel"
                    value={accountForm.phone}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, phone: e.target.value })
                    }
                    className="w-full bg-muted/50 border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                <textarea
                  value={accountForm.bio}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, bio: e.target.value })
                  }
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={accountForm.website}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, website: e.target.value })
                  }
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Notification Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose what notifications you want to receive.
              </p>
            </div>

            <div className="space-y-6">
              {/* Push Notifications */}
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-foreground">
                      Push Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your device
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={notificationSettings.pushEnabled}
                    onChange={(value) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        pushEnabled: value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Email Notifications */}
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-foreground">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={notificationSettings.emailEnabled}
                    onChange={(value) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailEnabled: value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Notification Types */}
              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="font-medium text-foreground">
                  Notification Types
                </h3>
                {[
                  {
                    key: "likes",
                    label: "Likes",
                    desc: "When someone likes your post",
                  },
                  {
                    key: "comments",
                    label: "Comments",
                    desc: "When someone comments on your post",
                  },
                  {
                    key: "follows",
                    label: "New Followers",
                    desc: "When someone follows you",
                  },
                  {
                    key: "mentions",
                    label: "Mentions",
                    desc: "When someone mentions you",
                  },
                  {
                    key: "messages",
                    label: "Messages",
                    desc: "When you receive a message",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={
                        notificationSettings[
                          item.key as keyof typeof notificationSettings
                        ] as boolean
                      }
                      onChange={(value) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Privacy Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Control who can see your content and interact with you.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "privateAccount",
                  label: "Private Account",
                  desc: "Only approved followers can see your posts",
                },
                {
                  key: "showActivityStatus",
                  label: "Show Activity Status",
                  desc: "Let others see when you're online",
                },
                {
                  key: "showReadReceipts",
                  label: "Show Read Receipts",
                  desc: "Let others know when you've read their messages",
                },
                {
                  key: "allowTagging",
                  label: "Allow Tagging",
                  desc: "Let others tag you in their posts",
                },
                {
                  key: "allowMentions",
                  label: "Allow Mentions",
                  desc: "Let others mention you in comments",
                },
              ].map((item) => (
                <div key={item.key} className="glass-card rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">
                        {item.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={
                        privacySettings[
                          item.key as keyof typeof privacySettings
                        ]
                      }
                      onChange={(value) =>
                        setPrivacySettings({
                          ...privacySettings,
                          [item.key]: value,
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Security Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Secure your account with additional protection.
              </p>
            </div>

            <div className="space-y-6">
              {/* Change Password */}
              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="font-medium text-foreground">Change Password</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <input
                    type="password"
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="New password"
                  />
                  <input
                    type="password"
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Confirm new password"
                  />
                  <button className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Auth */}
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={securitySettings.twoFactorEnabled}
                    onChange={(value) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorEnabled: value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Login Alerts */}
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Login Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <ToggleSwitch
                    enabled={securitySettings.loginAlerts}
                    onChange={(value) =>
                      setSecuritySettings({
                        ...securitySettings,
                        loginAlerts: value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Appearance
              </h2>
              <p className="text-sm text-muted-foreground">
                Customize how SocialHub looks for you.
              </p>
            </div>

            {/* Theme Selection */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-medium text-foreground mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map((option) => {
                  const Icon = option.icon;
                  const isSelected = theme === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id as any)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-medium text-foreground mb-4">Preview</h3>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20" />
                  <div className="space-y-1">
                    <div className="h-3 w-24 rounded-full bg-foreground/20" />
                    <div className="h-2 w-16 rounded-full bg-muted-foreground/20" />
                  </div>
                </div>
                <div className="h-32 rounded-lg bg-muted/30 mb-3" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/20" />
                  <div className="h-8 w-8 rounded-lg bg-muted/50" />
                  <div className="h-8 w-8 rounded-lg bg-muted/50" />
                </div>
              </div>
            </div>
          </div>
        );

      case "language":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Language & Region
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose your preferred language and regional settings.
              </p>
            </div>

            <div className="glass-card rounded-xl p-5">
              <label className="block text-sm font-medium text-foreground mb-3">
                Language
              </label>
              <select className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer">
                <option value="en">English</option>
                <option value="vi">Tieng Viet</option>
                <option value="es">Espanol</option>
                <option value="fr">Francais</option>
                <option value="de">Deutsch</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        );

      case "help":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Help & Support
              </h2>
              <p className="text-sm text-muted-foreground">
                Get help with using SocialHub.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Help Center", href: "#" },
                { label: "Report a Problem", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Community Guidelines", href: "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between p-4 glass-card rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <span className="text-foreground font-medium">
                    {item.label}
                  </span>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </a>
              ))}
            </div>

            <div className="glass-card rounded-xl p-5 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                SocialHub Version 1.0.0
              </p>
              <p className="text-xs text-muted-foreground">
                Built with Next.js & Love
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Mobile Back Button */}
        <div className="lg:hidden mb-4">
          <Link href="/">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="glass-card rounded-2xl p-3 sticky top-28">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={isActive ? "text-primary" : "text-muted-foreground"}
                      />
                      {item.label}
                    </button>
                  );
                })}

                <div className="border-t border-border my-2" />

                <button
                  onClick={handleLogOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <LogOut size={20} />
                  Log out
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 glass-card rounded-2xl p-6 lg:p-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
        enabled ? "bg-primary" : "bg-muted"
      }`}
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

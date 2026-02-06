"use client";

import React, { useState } from "react";
import {
  User,
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
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import useUser from "@/hooks/useUser";
import Header from "@/components/layout/Header";
import { changePassword } from "@/services/auth.service";
import { updateUser } from "@/services/user.service";

type SettingsTab = "account" | "security" | "appearance" | "language" | "help";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { userCurrent } = useUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark" | "system">(
    theme,
  );

  // Change password states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Form states
  const [accountForm, setAccountForm] = useState({
    username: userCurrent?.username || "",
    email: userCurrent?.gmail || "",
    phone: userCurrent?.phone || "",
    displayName: userCurrent?.displayname || "",
    bio: userCurrent?.description || "",
  });

  // Profile update states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );
  const [profileSuccess, setProfileSuccess] = useState("");

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
  });

  // Update form when userCurrent loads
  React.useEffect(() => {
    if (userCurrent) {
      setAccountForm((prev) => ({
        ...prev,
        username: userCurrent.username || "",
        displayName: userCurrent.displayname || "",
        email: userCurrent?.gmail || "",
        phone: userCurrent?.phone || "",
        bio: userCurrent?.description || "",
      }));
    }
  }, [userCurrent]);

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        setProfileErrors({ avatar: "Please select a valid image file" });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setProfileErrors({ avatar: "Image size must be less than 5MB" });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProfileErrors({});
      setProfileSuccess("");
    }
  };

  const handleUpdateProfile = async () => {
    setProfileErrors({});
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const formData = new FormData();

      // Only append fields that have been changed or filled
      if (
        accountForm.username &&
        accountForm.username !== userCurrent?.username
      ) {
        formData.append("username", accountForm.username);
      }
      if (accountForm.displayName) {
        formData.append("displayname", accountForm.displayName);
      }
      if (accountForm.email) {
        formData.append("email", accountForm.email);
      }
      if (accountForm.phone) {
        formData.append("phonenumber", accountForm.phone);
      }
      if (accountForm.bio) {
        formData.append("bio", accountForm.bio);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Check if there's anything to update
      if (
        !formData.has("username") &&
        !formData.has("displayname") &&
        !formData.has("email") &&
        !formData.has("phonenumber") &&
        !formData.has("bio") &&
        !formData.has("avatar")
      ) {
        setProfileErrors({ general: "No changes to save" });
        setProfileLoading(false);
        return;
      }

      await updateUser(formData);
      setProfileSuccess("Profile updated successfully!");

      // Reset avatar file after successful update
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error: any) {
      setProfileErrors({
        general: error.message || "Failed to update profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6 || password.length > 20) {
      return "Password must be 6-20 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(password)) {
      return "Password can only contain letters, numbers, and underscores";
    }
    return null;
  };

  const handleChangePassword = async () => {
    const errors: Record<string, string> = {};
    setPasswordSuccess("");

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else {
      const validationError = validatePassword(passwordForm.newPassword);
      if (validationError) {
        errors.newPassword = validationError;
      }
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setPasswordLoading(true);

    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setPasswordErrors({
        general: error.message || "Failed to change password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const menuItems = [
    { id: "account" as const, label: "Account", icon: User },
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

            {/* Success message */}
            {profileSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle2 size={16} />
                {profileSuccess}
              </div>
            )}

            {/* Error message */}
            {profileErrors.general && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle size={16} />
                {profileErrors.general}
              </div>
            )}

            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20">
                  <img
                    src={
                      avatarPreview ||
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
                    onChange={handleAvatarChange}
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
                {profileErrors.avatar && (
                  <p className="text-xs text-destructive mt-1">
                    {profileErrors.avatar}
                  </p>
                )}
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
                      onChange={(e) => {
                        setAccountForm({
                          ...accountForm,
                          username: e.target.value,
                        });
                        setProfileErrors({});
                        setProfileSuccess("");
                      }}
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
                    onChange={(e) => {
                      setAccountForm({
                        ...accountForm,
                        displayName: e.target.value,
                      });
                      setProfileErrors({});
                      setProfileSuccess("");
                    }}
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
                    onChange={(e) => {
                      setAccountForm({ ...accountForm, email: e.target.value });
                      setProfileErrors({});
                      setProfileSuccess("");
                    }}
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
                    onChange={(e) => {
                      setAccountForm({ ...accountForm, phone: e.target.value });
                      setProfileErrors({});
                      setProfileSuccess("");
                    }}
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
                  onChange={(e) => {
                    setAccountForm({ ...accountForm, bio: e.target.value });
                    setProfileErrors({});
                    setProfileSuccess("");
                  }}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpdateProfile}
                disabled={profileLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profileLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {profileLoading ? "Saving..." : "Save Changes"}
              </button>
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

                {/* Success message */}
                {passwordSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
                    <CheckCircle2 size={16} />
                    {passwordSuccess}
                  </div>
                )}

                {/* General error */}
                {passwordErrors.general && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    <AlertCircle size={16} />
                    {passwordErrors.general}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => {
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          });
                          setPasswordErrors((prev) => {
                            const { currentPassword, general, ...rest } = prev;
                            return rest;
                          });
                          setPasswordSuccess("");
                        }}
                        className={`w-full bg-muted/50 border rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          passwordErrors.currentPassword
                            ? "border-destructive"
                            : "border-border"
                        }`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-xs text-destructive">
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => {
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          });
                          setPasswordErrors((prev) => {
                            const { newPassword, general, ...rest } = prev;
                            return rest;
                          });
                          setPasswordSuccess("");
                        }}
                        className={`w-full bg-muted/50 border rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          passwordErrors.newPassword
                            ? "border-destructive"
                            : "border-border"
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-xs text-destructive">
                        {passwordErrors.newPassword}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      6-20 characters, only letters, numbers, and underscores
                      allowed.
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => {
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          });
                          setPasswordErrors((prev) => {
                            const { confirmPassword, general, ...rest } = prev;
                            return rest;
                          });
                          setPasswordSuccess("");
                        }}
                        className={`w-full bg-muted/50 border rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          passwordErrors.confirmPassword
                            ? "border-destructive"
                            : "border-border"
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-destructive">
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordLoading && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance": {
        const isDarkPreview =
          previewTheme === "dark" ||
          (previewTheme === "system" && resolvedTheme === "dark");
        const hasChanges = previewTheme !== theme;
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
                  // { id: "system", label: "System", icon: Monitor },
                ].map((option) => {
                  const Icon = option.icon;
                  const isSelected = previewTheme === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setPreviewTheme(option.id as any)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
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

            {/* Preview - Mini UI Demo */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-medium text-foreground mb-4">Preview</h3>
              <div
                className={`rounded-xl border overflow-hidden transition-colors duration-300 text-xs ${
                  isDarkPreview
                    ? "bg-[#0f0f1a] border-[#2a2a3e] text-gray-200"
                    : "bg-[#fafafa] border-[#e0e0e0] text-gray-800"
                }`}
              >
                {/* Mini Header */}
                <div
                  className={`flex items-center justify-between px-4 py-2 border-b ${
                    isDarkPreview
                      ? "bg-[#1a1a2e] border-[#2a2a3e]"
                      : "bg-white border-[#e0e0e0]"
                  }`}
                >
                  <span className="font-bold text-sm bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    SocialHub
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                        isDarkPreview ? "bg-white/10" : "bg-black/5"
                      }`}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full ${isDarkPreview ? "bg-white/10" : "bg-black/8"}`}
                    />
                  </div>
                </div>

                <div className="flex">
                  {/* Mini Sidebar */}
                  <div
                    className={`w-14 shrink-0 p-2 space-y-2 border-r hidden sm:block ${
                      isDarkPreview
                        ? "bg-[#141425] border-[#2a2a3e]"
                        : "bg-white border-[#e0e0e0]"
                    }`}
                  >
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-5 rounded-md ${
                          i === 0
                            ? isDarkPreview
                              ? "bg-blue-500/25"
                              : "bg-blue-500/15"
                            : isDarkPreview
                              ? "bg-white/5"
                              : "bg-black/5"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Mini Feed */}
                  <div className="flex-1 p-3 space-y-3">
                    {/* Mini Create Post */}
                    <div
                      className={`rounded-lg p-2.5 border ${
                        isDarkPreview
                          ? "bg-[#1a1a2e] border-[#2a2a3e]"
                          : "bg-white border-[#e0e0e0]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full shrink-0 ${isDarkPreview ? "bg-gradient-to-br from-purple-500/40 to-pink-500/40" : "bg-gradient-to-br from-purple-500/25 to-pink-500/25"}`}
                        />
                        <div
                          className={`flex-1 h-6 rounded-full px-2 flex items-center ${
                            isDarkPreview
                              ? "bg-white/5 text-white/30"
                              : "bg-black/5 text-black/30"
                          }`}
                        >
                          <span className="text-[10px]">
                            What&apos;s on your mind?
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mini Post Card */}
                    <div
                      className={`rounded-lg border overflow-hidden ${
                        isDarkPreview
                          ? "bg-[#1a1a2e] border-[#2a2a3e]"
                          : "bg-white border-[#e0e0e0]"
                      }`}
                    >
                      {/* Post Header */}
                      <div className="flex items-center gap-2 p-2.5">
                        <div
                          className={`w-7 h-7 rounded-full shrink-0 ${isDarkPreview ? "bg-blue-500/30" : "bg-blue-500/20"}`}
                        />
                        <div>
                          <div
                            className={`h-2.5 w-16 rounded-full ${isDarkPreview ? "bg-white/25" : "bg-black/15"}`}
                          />
                          <div
                            className={`h-2 w-10 rounded-full mt-1 ${isDarkPreview ? "bg-white/10" : "bg-black/8"}`}
                          />
                        </div>
                      </div>
                      {/* Post Image */}
                      <div
                        className={`mx-2.5 h-24 rounded-md ${
                          isDarkPreview
                            ? "bg-gradient-to-br from-blue-900/40 to-purple-900/40"
                            : "bg-gradient-to-br from-blue-100 to-purple-100"
                        }`}
                      />
                      {/* Post Actions */}
                      <div className="flex items-center gap-3 p-2.5">
                        <div className="flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={isDarkPreview ? "#ef4444" : "#ef4444"}
                            strokeWidth="2"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                          <span
                            className={`text-[10px] ${isDarkPreview ? "text-white/40" : "text-black/40"}`}
                          >
                            128
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={
                              isDarkPreview ? "text-white/40" : "text-black/40"
                            }
                          >
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                          </svg>
                          <span
                            className={`text-[10px] ${isDarkPreview ? "text-white/40" : "text-black/40"}`}
                          >
                            24
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={
                              isDarkPreview ? "text-white/40" : "text-black/40"
                            }
                          >
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" x2="12" y1="2" y2="15" />
                          </svg>
                          <span
                            className={`text-[10px] ${isDarkPreview ? "text-white/40" : "text-black/40"}`}
                          >
                            Share
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mini Post Card 2 (partial) */}
                    <div
                      className={`rounded-lg border overflow-hidden ${
                        isDarkPreview
                          ? "bg-[#1a1a2e] border-[#2a2a3e]"
                          : "bg-white border-[#e0e0e0]"
                      }`}
                    >
                      <div className="flex items-center gap-2 p-2.5">
                        <div
                          className={`w-7 h-7 rounded-full shrink-0 ${isDarkPreview ? "bg-green-500/30" : "bg-green-500/20"}`}
                        />
                        <div>
                          <div
                            className={`h-2.5 w-20 rounded-full ${isDarkPreview ? "bg-white/25" : "bg-black/15"}`}
                          />
                          <div
                            className={`h-2 w-12 rounded-full mt-1 ${isDarkPreview ? "bg-white/10" : "bg-black/8"}`}
                          />
                        </div>
                      </div>
                      <div className="px-2.5 pb-2.5 space-y-1">
                        <div
                          className={`h-2 w-full rounded-full ${isDarkPreview ? "bg-white/10" : "bg-black/8"}`}
                        />
                        <div
                          className={`h-2 w-3/4 rounded-full ${isDarkPreview ? "bg-white/10" : "bg-black/8"}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex items-center justify-end gap-3">
              {hasChanges && (
                <button
                  onClick={() => setPreviewTheme(theme)}
                  className="px-5 py-2.5 border border-border text-foreground font-semibold rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => setTheme(previewTheme)}
                disabled={!hasChanges}
                className={`px-6 py-2.5 font-semibold rounded-xl transition-colors cursor-pointer ${
                  hasChanges
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Apply
              </button>
            </div>
          </div>
        );
      }

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
                        className={
                          isActive ? "text-primary" : "text-muted-foreground"
                        }
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

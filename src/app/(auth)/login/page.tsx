"use client";
import { useUserStore } from "@/hooks/useUserStore";
import { login } from "@/services/auth.service";
import {
  CometChatUIKit,
  UIKitSettingsBuilder,
} from "@cometchat/chat-uikit-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const COMETCHAT_CONSTANTS = {
  APP_ID: process.env.NEXT_PUBLIC_COMETCHAT_APP_ID ?? "",
  REGION: process.env.NEXT_PUBLIC_COMETCHAT_REGION ?? "",
  AUTH_KEY: process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY ?? "",
};

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore.getState().setUser;
  const [error, setError] = useState("");
  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const initializeCometChat = async () => {
      try {
        const UIKitSettings = new UIKitSettingsBuilder()
          .setAppId(COMETCHAT_CONSTANTS.APP_ID)
          .setRegion(COMETCHAT_CONSTANTS.REGION)
          .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
          .subscribePresenceForAllUsers()
          .build();

        await CometChatUIKit.init(UIKitSettings);
        console.log("CometChat initialized successfully");
      } catch (error) {
        console.error("CometChat initialization failed:", error);
      }
    };
    initializeCometChat();
  }, []);

  const onSubmit = async (data: { username: string; password: string }) => {
    setError("");
    setIsLoading(true);
    try {
      if (!data.username || !data.password) {
        setError("Username và password không được để trống");
        setIsLoading(false);
        return;
      }
      const res = await login(data.username, data.password);
      if (!res) {
        setError(res.message || "Đăng nhập thất bại!");
        setIsLoading(false);
        return;
      }
      console.log("Đăng nhập thành công!");
      try {
        const user = await CometChatUIKit.login(data.username);
        console.log("Login Successful", { user });
        setUser(user);
        router.push("/");
      } catch (error) {
        console.error("Login failed", error);
        setError("CometChat login failed");
      }
    } catch (e: any) {
      console.error("Lỗi đăng nhập:", e);
      setError(e.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginGoogle = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Phone mockup */}
        <div className="hidden lg:flex justify-center">
          <div className="relative">
            <div className="w-80 h-[600px] bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/20 to-orange-100/20"></div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                    <img
                      src="/icon.png"
                      alt="Instagram"
                      className="w-20 h-20"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome to
                  </h2>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
                    Instagram Clone
                  </h1>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    Connect with friends and share your moments with the world
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-3">
                  <img src="/icon.png" alt="logo" className="w-10 h-10" />
                </div>
                <img src="/insta-logo.svg" alt="Instagram" className="h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600 text-sm">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    {...methods.register("username", { required: true })}
                    type="text"
                    placeholder="Phone number, username, or email"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 placeholder-gray-500"
                  />
                </div>
                <div className="relative">
                  <input
                    {...methods.register("password", { required: true })}
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 placeholder-gray-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <hr className="flex-1 border-gray-200" />
              <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                onClick={handleLoginGoogle}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={methods.handleSubmit(onSubmit)}
                className="w-full flex items-center justify-center py-3 px-4 border border-blue-200 rounded-xl text-blue-600 font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </button>
            </div>

            {/* Forgot password */}
            <div className="text-center mt-6">
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign up link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/auth/register"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import InstagramLogo from "./InstagramLogo";
import SocialLoginButtons from "./SocialLoginButtons";
import AppDownloadButtons from "./AppDownloadButtons";

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
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
        setError("Đăng nhập thất bại!");
        setIsLoading(false);
        return;
      }
      router.push("/");
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Login Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-10 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <InstagramLogo size="md" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Username Input */}
          <input
            {...register("username", { required: true })}
            type="text"
            placeholder="Phone Number, Username, or Email"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-500"
          />

          {/* Password Input */}
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-500"
          />

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              "LOGIN"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-4 text-gray-500 text-xs font-medium">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Login */}
        <SocialLoginButtons />

        {/* Forgot Password */}
        <div className="text-center mt-5">
          <a href="#" className="text-xs text-gray-800 hover:text-gray-600">
            Forgot Password?
          </a>
        </div>
      </div>

      {/* Sign Up Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-10 py-5 mt-3 text-center">
        <p className="text-sm text-gray-800">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 font-semibold hover:text-blue-600"
          >
            Sign Up
          </a>
        </p>
      </div>

      {/* App Download Section */}
      <div className="mt-5">
        <p className="text-center text-sm text-gray-800 mb-4">Get the App.</p>
        <AppDownloadButtons />
      </div>
    </div>
  );
}

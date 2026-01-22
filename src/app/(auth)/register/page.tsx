"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { register as registerAccount } from "@/services/auth.service";

type RegisterForm = {
  username: string;
  displayname: string;
  phone: string;
  password: string;
  repassword: string;
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const methods = useForm<RegisterForm>({
    defaultValues: {
      username: "",
      displayname: "",
      phone: "",
      password: "",
      repassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    if (data.password !== data.repassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }
    setIsLoading(true);
    try {
      await registerAccount(
        data.username,
        data.displayname,
        data.phone,
        data.password,
      );
    } catch (e: any) {
      setError(e?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
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
                    Create account
                  </h2>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
                    Instagram Clone
                  </h1>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    Join the community and start sharing your moments today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register form */}
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
                Create your account
              </h2>
              <p className="text-gray-600 text-sm">Sign up to get started</p>
            </div>

            {/* Register Form */}
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
                    placeholder="Username"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 placeholder-gray-500"
                  />
                </div>
                <div className="relative">
                  <input
                    {...methods.register("displayname", { required: true })}
                    type="text"
                    placeholder="Display name"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 placeholder-gray-500"
                  />
                </div>
                <div className="relative">
                  <input
                    {...methods.register("phone", { required: true })}
                    type="tel"
                    placeholder="Phone number"
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
                <div className="relative">
                  <input
                    {...methods.register("repassword", { required: true })}
                    type="password"
                    placeholder="Re-enter password"
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
                    Creating account...
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <hr className="flex-1 border-gray-200" />
              <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* Link to login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <a
                  href="/login"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Đăng nhập
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

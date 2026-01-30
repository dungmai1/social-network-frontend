"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { register as registerAccount } from "@/services/auth.service";
import InstagramLogo from "./InstagramLogo";
import AppDownloadButtons from "./AppDownloadButtons";

interface RegisterFormData {
  username: string;
  displayname: string;
  phone: string;
  password: string;
  repassword: string;
}

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit } = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      displayname: "",
      phone: "",
      password: "",
      repassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    if (data.password !== data.repassword) {
      setError("Passwords do not match");
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
      setError(e?.message || "An error occurred, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Register Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-10 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <InstagramLogo size="md" />
        </div>

        {/* Subtitle */}
        <p className="text-center text-gray-500 font-semibold text-base mb-4">
          Sign up to see photos and videos from your friends.
        </p>

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
            placeholder="Username"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-500"
          />

          {/* Display Name Input */}
          <input
            {...register("displayname", { required: true })}
            type="text"
            placeholder="Full Name"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-500"
          />

          {/* Phone Input */}
          <input
            {...register("phone", { required: true })}
            type="tel"
            placeholder="Phone Number"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-500"
          />

          {/* Password Input */}
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-500"
          />

          {/* Re-enter Password Input */}
          <input
            {...register("repassword", { required: true })}
            type="password"
            placeholder="Confirm Password"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-500"
          />

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By signing up, you agree to our{" "}
            <a href="#" className="text-blue-900 font-medium">
              Terms
            </a>
            ,{" "}
            <a href="#" className="text-blue-900 font-medium">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-900 font-medium">
              Cookies Policy
            </a>
            .
          </p>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-10 py-5 mt-3 text-center">
        <p className="text-sm text-gray-800">
          Have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 font-semibold hover:text-blue-600"
          >
            Log in
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

"use client";
import React, { Suspense } from "react";
import { LoginForm, PhoneMockup } from "@/components/auth";

function LoginFormFallback() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-10 py-8 animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-8 mx-auto w-32"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* Left side - Phone mockups */}
        <div className="hidden lg:flex items-center gap-[-20px]">
          <PhoneMockup variant="profile" className="z-10" />
          <PhoneMockup variant="feed" className="-ml-10 z-0" />
        </div>

        {/* Right side - Login form */}
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

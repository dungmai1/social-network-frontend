"use client";
import React from "react";
import { LoginForm, PhoneMockup } from "@/components/auth";

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
        <LoginForm />
      </div>
    </div>
  );
}

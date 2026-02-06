"use client";
import React from "react";
import { ForgotPasswordForm } from "@/components/auth";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

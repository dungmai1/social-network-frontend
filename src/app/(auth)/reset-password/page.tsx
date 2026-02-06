"use client";
import React, { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth";

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Suspense
          fallback={<div className="text-white text-center">Loading...</div>}
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { register as registerAccount } from "@/services/auth.service";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import AppLogo from "./AppLogo";
import Link from "next/link";

interface RegisterFormData {
  username: string;
  displayname: string;
  email: string;
  password: string;
  repassword: string;
}

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch } = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      displayname: "",
      email: "",
      password: "",
      repassword: "",
    },
  });

  const password = watch("password");
  const repassword = watch("repassword");

  const passwordsMatch = password && repassword && password === repassword;
  const passwordMinLength = password && password.length >= 8;

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    if (data.password !== data.repassword) {
      setError("Passwords do not match");
      return;
    }
    if (data.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);
    try {
      await registerAccount(
        data.username,
        data.displayname,
        data.email,
        data.password,
      );
      window.location.href = "/login";
    } catch (e: any) {
      setError(e?.message || "An error occurred, please try again");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Register Card */}
      <div className="glass-card rounded-2xl px-8 py-10 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <AppLogo size="lg" />
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Join Connectify
          </h1>
          <p className="text-muted-foreground text-sm">
            Create your account and start connecting
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm text-center">
              {error}
            </div>
          )}

          {/* Username Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              {...register("username", { required: true })}
              type="text"
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-muted-foreground"
            />
          </div>

          {/* Display Name Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              {...register("displayname", { required: true })}
              type="text"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-muted-foreground"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-muted-foreground"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              {...register("password", { required: true })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              {...register("repassword", { required: true })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full pl-12 pr-12 py-3.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="space-y-2 p-3 bg-muted/30 rounded-xl">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Password requirements:
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordMinLength ? "bg-green-500" : "bg-muted"}`}
              >
                {passwordMinLength && <Check className="w-3 h-3 text-white" />}
              </div>
              <span
                className={`text-xs ${passwordMinLength ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
              >
                At least 8 characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordsMatch ? "bg-green-500" : "bg-muted"}`}
              >
                {passwordsMatch && <Check className="w-3 h-3 text-white" />}
              </div>
              <span
                className={`text-xs ${passwordsMatch ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
              >
                Passwords match
              </span>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-primary hover:underline font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-primary via-secondary to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-glow flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Login Card */}
      <div className="glass-card rounded-2xl px-8 py-5 mt-4 text-center shadow-lg">
        <p className="text-sm text-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

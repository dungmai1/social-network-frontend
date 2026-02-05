"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/services/auth.service";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import AppLogo from "./AppLogo";
import SocialLoginButtons from "./SocialLoginButtons";
import Link from "next/link";

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        setError("Username and password cannot be empty");
        setIsLoading(false);
        return;
      }
      const res = await login(data.username, data.password);
      if (!res) {
        setError("Login failed!");
        setIsLoading(false);
        return;
      }
      
      // Redirect to intended page or home
      const intendedPath = searchParams.get("from") || "/";
      router.push(intendedPath);
    } catch (e: any) {
      setError(e.message || "An error occurred, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Login Card */}
      <div className="glass-card rounded-2xl px-8 py-10 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <AppLogo size="lg" />
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to continue to your community
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
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              {...register("username", { required: true })}
              type="text"
              placeholder="Email or Username"
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

          {/* Forgot Password */}
          <div className="text-right">
            <Link 
              href="#" 
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-primary via-secondary to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-glow flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-1 border-border" />
          <span className="px-4 text-muted-foreground text-xs font-medium uppercase tracking-wider">
            or continue with
          </span>
          <hr className="flex-1 border-border" />
        </div>

        {/* Social Login */}
        <SocialLoginButtons />
      </div>

      {/* Sign Up Card */}
      <div className="glass-card rounded-2xl px-8 py-5 mt-4 text-center shadow-lg">
        <p className="text-sm text-foreground">
          New to Connectify?{" "}
          <Link
            href="/register"
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="#" className="text-primary hover:underline">Terms</Link>
          {" "}and{" "}
          <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

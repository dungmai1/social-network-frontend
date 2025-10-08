"use client";
import { login } from "@/app/api/auth/routes";
import React from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const methods = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async () => {
    try {
      const res = await login(
        methods.getValues().username,
        methods.getValues().password
      );
      if (res.success) {
        console.log("Đăng nhập thành công!");
      } else {
        console.log(res.message || "Đăng nhập thất bại!");
      }
    } catch (e) {
      console.log("Lỗi đăng nhập:", e);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFFCFC]">
      <div className="text-center mr-20">
        <img
          src="/instagram-logo.png"
          alt="Instagram Logo"
          className="w-[32rem] h-[30rem]"
        />
      </div>
      <div className="bg-white shadow-md rounded-2xl p-8 w-[350px] text-center">
        <div className="flex justify-center text-center mb-4">
          <img src="/icon.png" alt="logo" className="w-20 h-20 mr-3" />
          <img src="/insta-logo.svg" alt="logo" />
        </div>

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <input
            {...methods.register("username", { required: true })}
            type="text"
            placeholder="Phone number, username, or email"
            className="w-full mb-3 px-3 py-2 border rounded-md text-sm bg-gray-200 text-black border-solid border-gray-300"
          />
          <input
            {...methods.register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="w-full mb-3 px-3 py-2 border rounded-md text-sm bg-gray-200 text-black border-solid border-gray-300"
          />
        </form>
        <button
          className="w-full text-white py-2 rounded-md font-bold"
          style={{
            background:
              "linear-gradient(90deg, #A336BD 0%, #FF387D 31%, #FF5D34 68%, #FFAA1B 100%)",
          }}
          onClick={methods.handleSubmit(onSubmit)}
        >
          LOGIN
        </button>
        <div className="my-4 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        <div className="flex justify-center space-x-3">
          <button
            className="w-full border border-solid border-blue-500 text-[#1877F2] py-2 rounded-md font-bold"
            onClick={methods.handleSubmit(onSubmit)}
          >
            Login with Facebook
          </button>
        </div>
        <div className="flex justify-center space-x-3 mt-3">
          <button
            className="w-full bg-red-500 text-white py-2 rounded-md font-bold"
            onClick={methods.handleSubmit(onSubmit)}
          >
            Login with Google
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-500">Forgot password?</div>
        <div className="mt-6 text-sm text-[#1877F2] font-bold">
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-[#1877F2] font-bold">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

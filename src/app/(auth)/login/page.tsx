"use client";
import { login } from '@/app/api/auth/routes';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const methods = useForm(
    {
      defaultValues: {
        username: "",
        password:""
      }
    }
  );
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-2xl p-8 w-[350px] text-center">
        <h1 className="text-3xl font-bold mb-6">Instagram</h1>
         <form onSubmit={methods.handleSubmit(onSubmit)}>
        <input
          {...methods.register("username", { required: true })}
          type="text"
          placeholder="Phone number, username, or email"
          className="w-full mb-3 px-3 py-2 border rounded-md text-sm bg-gray-200 text-black border-none"
        />
        <input
          {...methods.register("password", { required: true })}
          type="password"
          placeholder="Password"
          className="w-full mb-3 px-3 py-2 border rounded-md text-sm bg-gray-200 text-black border-none"
        />
        </form>
          <button className="w-full bg-blue-500 text-white py-2 rounded-md font-medium" onClick={methods.handleSubmit(onSubmit)}>
          Log In
        </button>
        <div className="my-4 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        <div className="flex justify-center space-x-3">
          <button className="flex items-center space-x-1 text-blue-700 font-medium">
            <span>Facebook</span>
          </button>
          <button className="flex items-center space-x-1 text-red-500 font-medium">
            <span>Google</span>
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Forgot password?
        </div>
        <div className="mt-6 text-sm">
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-blue-500 font-medium">
            Create new one
          </a>
        </div>
      </div>
    </div>
  );
}

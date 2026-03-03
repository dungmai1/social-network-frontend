"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const API_BASE_AUTH =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${API_BASE_AUTH}/api/me`, {
        credentials: "include",
      });
      console.log(res.status);
      if (!res.ok) {
        redirect("/login");
      }
    };
    checkAuth();
  }, []);

  return <>{children}</>;
}

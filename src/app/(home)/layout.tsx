"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE_AUTH =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${API_BASE_AUTH}/api/me`, {
        credentials: "include",
      });
      console.log(res.status);
      if (!res.ok) {
        router.replace("/login");
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, []);

  if (!isAuthorized) return null;

  return <>{children}</>;
}

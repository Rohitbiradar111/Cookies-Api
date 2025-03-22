"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const redirectToLogin = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getToken();
      if (!token) {
        router.push("/login");
      }
    }
  }, [router]);
};

export const redirectToDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = getToken();
      if (token) {
        router.push("/dashboard");
      }
    }
  }, [router]);
};

const getToken = () => {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken"));

  return cookies ? cookies.split("=")[1] : null;
};

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="h-screen w-full flex-center gap-7">
      <h1 className="text-5xl">SellCord</h1>
    </div>
  );
}

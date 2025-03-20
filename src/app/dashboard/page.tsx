"use client";

import { redirectToLogin } from "@/utils/FindToken";

export default function DashboardPage() {
  redirectToLogin();
  return <div className="text-4xl">This is Dashboard Page</div>;
}

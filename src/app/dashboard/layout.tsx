import type { Metadata } from "next";
import "@/style/globals.css";
import { SidebarLayout, SidebarProvider } from "@/components/core/sidebar";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "dashboard",
  description: "dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-Sora">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <SidebarLayout>{children}</SidebarLayout>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

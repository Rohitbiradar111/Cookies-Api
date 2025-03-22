import type { Metadata } from "next";
import "@/style/globals.css";
import { SidebarLayout, SidebarProvider } from "@/components/core/sidebar";
import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  title: "Users",
  description: "Users",
};

export default function UsersLayout({
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

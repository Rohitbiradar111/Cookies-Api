import type { Metadata } from "next";
import "@/style/globals.css";
import { SidebarLayout, SidebarProvider } from "@/components/core/sidebar";
import { ThemeProvider } from "@/providers/theme-provider";
import Providers from "@/redux/Provider";

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
            <SidebarLayout>
              <Providers>{children}</Providers>
            </SidebarLayout>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

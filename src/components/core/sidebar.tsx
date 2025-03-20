"use client";

import { useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Home, Menu, Palette, Settings, X } from "lucide-react";
import { createContext, useContext } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { logout } from "@/utils/auth";

// Define sidebar context type
interface SidebarContextType {
  expanded: boolean;
  toggleSidebar: () => void;
  setExpanded: (value: boolean) => void;
  loading: boolean;
}

// Create context for sidebar
const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  toggleSidebar: () => {},
  setExpanded: () => {},
  loading: true,
});

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <SidebarContext.Provider
      value={{ expanded, toggleSidebar, setExpanded, loading }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarState() {
  return useContext(SidebarContext);
}

// Define types
type Route = {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  hasSubmenu?: boolean;
  actionIcon?: React.ReactNode;
  submenu?: {
    path: string;
    label: string;
    badge?: number;
  }[];
};

// Skeleton components for loading states
function SidebarSkeletonItem() {
  return (
    <div className="flex items-center gap-3 px-3 py-2 mb-1">
      <Skeleton className="h-5 w-5 rounded-md" />
      <Skeleton className="h-4 w-24 rounded-md" />
    </div>
  );
}

function SidebarCollapsedSkeletonItem() {
  return (
    <div className="flex justify-center py-3 mb-2">
      <Skeleton className="h-5 w-5 rounded-md" />
    </div>
  );
}

export function ModernSidebar() {
  const pathname = usePathname();
  const { expanded, loading } = useSidebarState();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [hoverItem, setHoverItem] = useState<string | null>(null);

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Define routes with their paths
  const routes: Route[] = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
  ];

  const footerRoutes: Route[] = [
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  // Toggle submenu function
  const toggleSubmenu = (path: string) => {
    setActiveSubmenu(activeSubmenu === path ? null : path);
  };

  // Check if a path is active
  const isActive = (path: string) => pathname === path;

  // Check if submenu should be active
  const isSubmenuActive = (path: string) => pathname?.startsWith(path);

  // Set active submenu based on current path
  useEffect(() => {
    routes.forEach((route) => {
      if (route.hasSubmenu && pathname?.startsWith(route.path)) {
        setActiveSubmenu(route.path);
      }
    });
  }, [pathname]);

  // Handle create menu
  const handleCreateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreateMenuOpen(!createMenuOpen);
  };

  return (
    <>
      {/* Expanded sidebar */}
      {expanded && (
        <div className="fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r border-border">
          <div className="flex h-full flex-col">
            {/* Main navigation */}
            <nav className="mt-5 flex-1 px-2 overflow-y-auto">
              {loading
                ? // Skeleton for expanded sidebar items
                  Array(routes.length)
                    .fill(0)
                    .map((_, index) => (
                      <SidebarSkeletonItem key={`expanded-skeleton-${index}`} />
                    ))
                : routes.map((route) => (
                    <div key={route.path} className="mb-1">
                      {route.hasSubmenu ? (
                        <>
                          <button
                            onClick={() => toggleSubmenu(route.path)}
                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                              isSubmenuActive(route.path)
                                ? "bg-secondary text-secondary-foreground"
                                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center">
                              <route.icon className="h-5 w-5" />
                              <span className="ml-3">{route.label}</span>
                            </div>
                            {route.actionIcon && (
                              <div
                                className="p-1 rounded-md hover:bg-muted"
                                onClick={handleCreateClick}
                              >
                                {route.actionIcon}
                              </div>
                            )}
                          </button>

                          {/* Submenu items */}
                          {activeSubmenu === route.path && route.submenu && (
                            <div className="ml-9 mt-1 space-y-1">
                              {route.submenu.map((item) => (
                                <Link
                                  key={item.path}
                                  href={item.path}
                                  className={`flex items-center justify-between rounded-md py-2 text-sm ${
                                    isActive(item.path)
                                      ? "text-foreground"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  <span>{item.label}</span>
                                  {item.badge && (
                                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={route.path}
                          className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                            isActive(route.path)
                              ? "bg-secondary text-secondary-foreground"
                              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center">
                            <route.icon className="h-5 w-5" />
                            <span className="ml-3">{route.label}</span>
                          </div>
                          {route.actionIcon && (
                            <div className="p-1 rounded-md hover:bg-muted">
                              {route.actionIcon}
                            </div>
                          )}
                        </Link>
                      )}
                    </div>
                  ))}
            </nav>
            <div className="mt-auto mb-4 px-2">
              <button
                className="w-full rounded-md bg-purple-900 px-3 py-2 text-sm text-white hover:bg-opacity-80"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SidebarToggle() {
  const { toggleSidebar, loading } = useSidebarState();

  return (
    <button
      onClick={toggleSidebar}
      className="rounded-md p-2 text-foreground hover:bg-muted"
      aria-label="Toggle sidebar"
      disabled={loading}
    >
      {loading ? (
        <Skeleton className="h-5 w-5 rounded-md" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </button>
  );
}

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { expanded, loading } = useSidebarState();

  return (
    <div className="flex min-h-screen bg-background">
      <ModernSidebar />

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          expanded ? "ml-64" : "ml-20"
        }`}
      >
        {/* Page content */}
        <main className="p-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 rounded-md" />
              <Skeleton className="h-64 w-full rounded-md" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Sidebar } from "@/components/admin/sidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, activeRestaurantId } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("oxyfood-token")
          : null;

      if (!isAuthenticated && !storedToken) {
        router.replace("/login");
        return;
      }

      if (
        isAuthenticated &&
        !activeRestaurantId &&
        pathname !== "/admin/onboarding"
      ) {
        router.replace("/admin/onboarding");
        return;
      }

      if (
        isAuthenticated &&
        activeRestaurantId &&
        pathname === "/admin/onboarding"
      ) {
        router.replace("/admin/dashboard");
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, activeRestaurantId, router, pathname]);

  if (isChecking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm text-muted-foreground">A carregar...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/onboarding") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      {children}
    </div>
  );
}

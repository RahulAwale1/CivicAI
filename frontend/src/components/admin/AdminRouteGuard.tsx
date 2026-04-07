"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { useAdminAuth } from "@/hooks/useAdminAuth";

type AdminRouteGuardProps = {
  children: React.ReactNode;
};

export default function AdminRouteGuard({
  children,
}: AdminRouteGuardProps) {
  const router = useRouter();
  const { loading, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
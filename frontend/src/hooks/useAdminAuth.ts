"use client";

import { useEffect, useState } from "react";
import { getCurrentAdmin } from "@/lib/api";
import { getAdminToken, removeAdminToken } from "@/lib/auth";
import type { AdminUser } from "@/lib/types";

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentAdmin(token)
      .then((data) => setAdmin(data))
      .catch(() => {
        removeAdminToken();
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { admin, loading, isAuthenticated: !!admin };
}
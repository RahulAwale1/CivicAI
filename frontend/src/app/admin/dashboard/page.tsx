"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import MetricCard from "@/components/admin/MetricCard";
import Loader from "@/components/common/Loader";
import { getDashboardStats } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";
import type { DashboardStats } from "@/lib/types";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      const token = getAdminToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setError("");
        const data = await getDashboardStats(token);
        setStats(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load dashboard stats";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <AdminHeader
            title="Dashboard"
            subtitle="Overview of CivicAI administration."
          />

          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Signed in as <span className="font-medium">{admin?.email}</span>
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          ) : stats ? (
            <div className="space-y-8">
              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Cities
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard label="Total Cities" value={stats.cities.total} />
                  <MetricCard label="Active Cities" value={stats.cities.active} />
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Documents
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  <MetricCard label="Total" value={stats.documents.total} />
                  <MetricCard label="Uploaded" value={stats.documents.uploaded} />
                  <MetricCard label="Queued" value={stats.documents.queued} />
                  <MetricCard label="Processing" value={stats.documents.processing} />
                  <MetricCard label="Processed" value={stats.documents.processed} />
                  <MetricCard label="Failed" value={stats.documents.failed} />
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Jobs
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  <MetricCard label="Total Jobs" value={stats.jobs.total} />
                  <MetricCard label="Queued" value={stats.jobs.queued} />
                  <MetricCard label="Running" value={stats.jobs.running} />
                  <MetricCard label="Completed" value={stats.jobs.completed} />
                  <MetricCard label="Failed" value={stats.jobs.failed} />
                </div>
              </section>
            </div>
          ) : null}
        </main>
      </div>
    </AdminRouteGuard>
  );
}
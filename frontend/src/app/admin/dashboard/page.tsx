"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <AdminHeader
            title="Dashboard"
            subtitle="Overview of CivicAI administration."
          />

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-600">
              Signed in as <span className="font-medium">{admin?.email}</span>
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500">Cities</div>
                <div className="mt-2 text-2xl font-semibold">—</div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500">Documents</div>
                <div className="mt-2 text-2xl font-semibold">—</div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500">Queued Jobs</div>
                <div className="mt-2 text-2xl font-semibold">—</div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-sm text-gray-500">Processed Docs</div>
                <div className="mt-2 text-2xl font-semibold">—</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminRouteGuard>
  );
}
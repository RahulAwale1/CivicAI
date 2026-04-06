"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <AdminHeader
          title="Dashboard"
          subtitle="Overview of CivicAI administration."
        />

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-600">
            Dashboard content will be implemented in later steps.
          </p>
        </div>
      </main>
    </div>
  );
}
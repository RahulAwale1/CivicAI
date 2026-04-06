"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminJobsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <AdminHeader
          title="Jobs"
          subtitle="Monitor and run document processing jobs."
        />

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-600">
            Jobs monitoring UI will be implemented in a later step.
          </p>
        </div>
      </main>
    </div>
  );
}
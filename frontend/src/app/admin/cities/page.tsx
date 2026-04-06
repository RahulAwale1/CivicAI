"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminCitiesPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <AdminHeader
          title="Cities"
          subtitle="Create, update, and manage supported cities."
        />

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-600">
            City management UI will be implemented in the next step.
          </p>
        </div>
      </main>
    </div>
  );
}
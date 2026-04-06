"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDocumentsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <AdminHeader
          title="Documents"
          subtitle="Upload municipal by-law PDFs and queue them for processing."
        />

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-600">
            Document upload and batch processing UI will be implemented next.
          </p>
        </div>
      </main>
    </div>
  );
}
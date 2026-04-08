"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DocumentTable from "@/components/admin/DocumentTable";
import DocumentUploadForm from "@/components/admin/DocumentUploadForm";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import {
  createProcessingJobs,
  getAllCities,
  getDocuments,
  uploadDocument,
} from "@/lib/api";
import { getAdminToken } from "@/lib/auth";
import type { City, Document } from "@/lib/types";

export default function AdminDocumentsPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("");

  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadPageData() {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setError("");

      const [citiesData, documentsData] = await Promise.all([
        getAllCities(token),
        getDocuments(token),
      ]);

      setCities(citiesData);
      setDocuments(documentsData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load documents page";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  const filteredDocuments = useMemo(() => {
    if (!selectedCityFilter) return documents;
    return documents.filter(
      (doc) => String(doc.city_id) === String(selectedCityFilter)
    );
  }, [documents, selectedCityFilter]);

  function handleToggleSelect(documentId: number) {
    setSelectedDocumentIds((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  }

  function handleToggleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedDocumentIds(filteredDocuments.map((doc) => doc.id));
    } else {
      setSelectedDocumentIds([]);
    }
  }

  async function handleUpload(formData: FormData) {
    const token = getAdminToken();
    if (!token) return;

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      await uploadDocument(token, formData);
      toast.success("Document uploaded successfully.");
      setSelectedDocumentIds([]);
      await loadPageData();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload document";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  async function handleProcessSelected() {
    const token = getAdminToken();
    if (!token || !selectedDocumentIds.length) return;

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      await createProcessingJobs(token, selectedDocumentIds);
      toast.success("Processing jobs created successfully.");
      setSelectedDocumentIds([]);
      await loadPageData();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create processing jobs";
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <AdminHeader
            title="Documents"
            subtitle="Upload municipal by-law PDFs and queue them for processing."
          />

          <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Upload Document
              </h2>

              <DocumentUploadForm
                cities={cities}
                loading={uploading}
                onSubmit={handleUpload}
              />

              {success ? (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                  {success}
                </div>
              ) : null}

              {error ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Documents
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredDocuments.length} shown
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <select
                    value={selectedCityFilter}
                    onChange={(e) => {
                      setSelectedCityFilter(e.target.value);
                      setSelectedDocumentIds([]);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleProcessSelected}
                    disabled={!selectedDocumentIds.length || processing}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {processing
                      ? "Processing..."
                      : `Process Selected (${selectedDocumentIds.length})`}
                  </button>
                </div>
              </div>

              {loading ? (
                <Loader />
              ) : (
                <DocumentTable
                  documents={filteredDocuments}
                  cities={cities}
                  selectedDocumentIds={selectedDocumentIds}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </AdminRouteGuard>
  );
}
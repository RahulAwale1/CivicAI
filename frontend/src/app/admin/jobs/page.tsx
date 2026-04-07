"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import JobTable from "@/components/admin/JobTable";
import Loader from "@/components/common/Loader";
import { getAllCities, getDocuments, getJobs, runNextJob } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";
import type { City, Document, ProcessingJob } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdminJobsPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);

  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [runningNext, setRunningNext] = useState(false);

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

      const [citiesData, documentsData, jobsData] = await Promise.all([
        getAllCities(token),
        getDocuments(token),
        getJobs(token),
      ]);

      setCities(citiesData);
      setDocuments(documentsData);
      setJobs(jobsData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load jobs page";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!selectedCityFilter) return jobs;
    return jobs.filter(
      (job) => String(job.city_id) === String(selectedCityFilter)
    );
  }, [jobs, selectedCityFilter]);

  async function handleRunNext() {
    const token = getAdminToken();
    if (!token) return;

    try {
      setRunningNext(true);
      setError("");
      setSuccess("");

      await runNextJob(token);
      toast.success("Next queued job processed successfully.");
      await loadPageData();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to run next queued job";
      toast.error(message);
    } finally {
      setRunningNext(false);
    }
  }

  const queuedCount = jobs.filter((job) => job.status === "queued").length;

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <AdminHeader
            title="Jobs"
            subtitle="Monitor and run document processing jobs."
          />

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Processing Jobs
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredJobs.length} shown · {queuedCount} queued
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <select
                  value={selectedCityFilter}
                  onChange={(e) => setSelectedCityFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleRunNext}
                  disabled={runningNext || queuedCount === 0}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {runningNext ? "Running..." : "Run Next Queued Job"}
                </button>
              </div>
            </div>

            {success ? (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {loading ? (
              <Loader />
            ) : (
              <JobTable
                jobs={filteredJobs}
                cities={cities}
                documents={documents}
              />
            )}
          </div>
        </main>
      </div>
    </AdminRouteGuard>
  );
}
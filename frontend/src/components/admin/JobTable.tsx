"use client";

import StatusBadge from "@/components/admin/StatusBadge";
import type { City, ProcessingJob, Document } from "@/lib/types";

type JobTableProps = {
  jobs: ProcessingJob[];
  cities: City[];
  documents?: Document[];
};

export default function JobTable({
  jobs,
  cities,
  documents = [],
}: JobTableProps) {
  function getCityName(cityId: number) {
    return cities.find((city) => city.id === cityId)?.name || `City ${cityId}`;
  }

  function getDocumentTitle(documentId: number) {
    return (
      documents.find((document) => document.id === documentId)?.title ||
      `Document ${documentId}`
    );
  }

  if (!jobs.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
        No processing jobs found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3 font-medium">Job ID</th>
            <th className="px-4 py-3 font-medium">Document</th>
            <th className="px-4 py-3 font-medium">City</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Started</th>
            <th className="px-4 py-3 font-medium">Completed</th>
            <th className="px-4 py-3 font-medium">Error</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-b border-gray-200 last:border-b-0 dark:border-gray-800"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                {job.id}
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {getDocumentTitle(job.document_id)}
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {getCityName(job.city_id)}
              </td>

              <td className="px-4 py-3">
                <StatusBadge status={job.status} />
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {job.started_at
                  ? new Date(job.started_at).toLocaleString()
                  : "—"}
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {job.completed_at
                  ? new Date(job.completed_at).toLocaleString()
                  : "—"}
              </td>

              <td className="max-w-xs px-4 py-3 text-gray-600 dark:text-gray-400">
                <span className="line-clamp-2">{job.error_message || "—"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
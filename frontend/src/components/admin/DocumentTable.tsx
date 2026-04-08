"use client";

import StatusBadge from "@/components/admin/StatusBadge";
import type { City, Document } from "@/lib/types";

type DocumentTableProps = {
  documents: Document[];
  cities: City[];
  selectedDocumentIds: number[];
  onToggleSelect: (documentId: number) => void;
  onToggleSelectAll: (checked: boolean) => void;
};

export default function DocumentTable({
  documents,
  cities,
  selectedDocumentIds,
  onToggleSelect,
  onToggleSelectAll,
}: DocumentTableProps) {
  const allSelected =
    documents.length > 0 &&
    documents.every((doc) => selectedDocumentIds.includes(doc.id));

  function getCityName(cityId: number) {
    return cities.find((city) => city.id === cityId)?.name || `City ${cityId}`;
  }

  if (!documents.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
        No documents uploaded yet. Upload your first PDF to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onToggleSelectAll(e.target.checked)}
              />
            </th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">File</th>
            <th className="px-4 py-3 font-medium">City</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Uploaded</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((document) => (
            <tr
              key={document.id}
              className="border-b border-gray-200 last:border-b-0 dark:border-gray-800"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedDocumentIds.includes(document.id)}
                  onChange={() => onToggleSelect(document.id)}
                />
              </td>

              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                {document.title}
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {document.original_filename}
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {getCityName(document.city_id)}
              </td>

              <td className="px-4 py-3">
                <StatusBadge status={document.status} />
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {new Date(document.uploaded_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
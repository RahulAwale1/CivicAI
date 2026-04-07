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
      <div className="rounded-xl border border-dashed p-6 text-sm text-gray-600">
        No documents found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-700">
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
            <tr key={document.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedDocumentIds.includes(document.id)}
                  onChange={() => onToggleSelect(document.id)}
                />
              </td>

              <td className="px-4 py-3 font-medium text-gray-900">
                {document.title}
              </td>

              <td className="px-4 py-3 text-gray-600">
                {document.original_filename}
              </td>

              <td className="px-4 py-3 text-gray-600">
                {getCityName(document.city_id)}
              </td>

              <td className="px-4 py-3">
                <StatusBadge status={document.status} />
              </td>

              <td className="px-4 py-3 text-gray-600">
                {new Date(document.uploaded_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
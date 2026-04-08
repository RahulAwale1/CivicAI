"use client";

import { useState } from "react";
import { getDocumentLink } from "@/lib/api";
import type { Citation } from "@/lib/types";

type CitationListProps = {
  citations: Citation[];
};

type GroupedCitation = {
  document_id: number;
  title: string;
  pages: number[];
};

export default function CitationList({ citations }: CitationListProps) {
  const [loadingDocId, setLoadingDocId] = useState<number | null>(null);
  const [error, setError] = useState("");

  if (!citations.length) {
    return null;
  }

  const groupedMap = new Map<number, GroupedCitation>();

  for (const citation of citations) {
    const existing = groupedMap.get(citation.document_id);

    if (existing) {
      if (
        citation.page_number !== null &&
        !existing.pages.includes(citation.page_number)
      ) {
        existing.pages.push(citation.page_number);
      }
    } else {
      groupedMap.set(citation.document_id, {
        document_id: citation.document_id,
        title: citation.title,
        pages: citation.page_number !== null ? [citation.page_number] : [],
      });
    }
  }

  const groupedCitations = Array.from(groupedMap.values()).map((group) => ({
    ...group,
    pages: [...group.pages].sort((a, b) => a - b),
  }));

  async function handleOpenPdf(documentId: number) {
    try {
      setError("");
      setLoadingDocId(documentId);

      const result = await getDocumentLink(documentId);
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to open document";
      setError(message);
    } finally {
      setLoadingDocId(null);
    }
  }

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
        Sources
      </h3>

      {error ? (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        {groupedCitations.map((citation) => (
          <div
            key={citation.document_id}
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {citation.title}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {citation.pages.length
                    ? `Pages ${citation.pages.join(", ")}`
                    : "Page information unavailable"}
                </div>
              </div>

              <button
                onClick={() => handleOpenPdf(citation.document_id)}
                disabled={loadingDocId === citation.document_id}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-white disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {loadingDocId === citation.document_id ? "Opening..." : "Open PDF"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import StatusBadge from "@/components/admin/StatusBadge";
import type { City } from "@/lib/types";

type CityTableProps = {
  cities: City[];
  onEdit: (city: City) => void;
  onDeactivate: (city: City) => void;
};

export default function CityTable({
  cities,
  onEdit,
  onDeactivate,
}: CityTableProps) {
  if (!cities.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
        No cities found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Province</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {cities.map((city) => (
            <tr
              key={city.id}
              className="border-b border-gray-200 last:border-b-0 dark:border-gray-800"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                {city.name}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {city.slug}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {city.province}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={city.is_active ? "active" : "inactive"} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(city)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Edit
                  </button>

                  {city.is_active ? (
                    <button
                      onClick={() => onDeactivate(city)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
                    >
                      Deactivate
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
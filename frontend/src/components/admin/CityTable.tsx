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
      <div className="rounded-xl border border-dashed p-6 text-sm text-gray-600">
        No cities found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-700">
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
            <tr key={city.id} className="border-b last:border-b-0">
              <td className="px-4 py-3 font-medium text-gray-900">
                {city.name}
              </td>
              <td className="px-4 py-3 text-gray-600">{city.slug}</td>
              <td className="px-4 py-3 text-gray-600">{city.province}</td>
              <td className="px-4 py-3">
                <StatusBadge status={city.is_active ? "active" : "inactive"} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(city)}
                    className="rounded-lg border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  {city.is_active ? (
                    <button
                      onClick={() => onDeactivate(city)}
                      className="rounded-lg border px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
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
"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CityForm from "@/components/admin/CityForm";
import CityTable from "@/components/admin/CityTable";
import Loader from "@/components/common/Loader";
import {
  createCity,
  deactivateCity,
  getAllCities,
  updateCity,
} from "@/lib/api";
import { getAdminToken } from "@/lib/auth";
import type { City } from "@/lib/types";

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingCity, setEditingCity] = useState<City | null>(null);

  async function loadCities() {
    const token = getAdminToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setError("");
      const data = await getAllCities(token);
      setCities(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load cities";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCities();
  }, []);

  async function handleCreate(values: {
    name: string;
    slug: string;
    province: string;
    is_active: boolean;
  }) {
    const token = getAdminToken();
    if (!token) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createCity(token, values);
      setSuccess("City created successfully.");
      await loadCities();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create city";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(values: {
    name: string;
    slug: string;
    province: string;
    is_active: boolean;
  }) {
    const token = getAdminToken();
    if (!token || !editingCity) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await updateCity(token, editingCity.id, values);
      setSuccess("City updated successfully.");
      setEditingCity(null);
      await loadCities();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update city";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate(city: City) {
    const token = getAdminToken();
    if (!token) return;

    const confirmed = window.confirm(
      `Deactivate ${city.name}? It will no longer appear in public city selection.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deactivateCity(token, city.id);
      setSuccess("City deactivated successfully.");
      await loadCities();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to deactivate city";
      setError(message);
    }
  }

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <AdminHeader
            title="Cities"
            subtitle="Create, update, and manage supported cities."
          />

          <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {editingCity ? "Edit City" : "Add City"}
              </h2>

              <CityForm
                initialValues={editingCity ?? undefined}
                submitLabel={editingCity ? "Update City" : "Create City"}
                loading={submitting}
                onSubmit={editingCity ? handleUpdate : handleCreate}
                onCancel={editingCity ? () => setEditingCity(null) : undefined}
              />

              {success ? (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  {success}
                </div>
              ) : null}

              {error ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Cities
                </h2>
                <span className="text-sm text-gray-500">
                  {cities.length} total
                </span>
              </div>

              {loading ? (
                <Loader />
              ) : (
                <CityTable
                  cities={cities}
                  onEdit={setEditingCity}
                  onDeactivate={handleDeactivate}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </AdminRouteGuard>
  );
}
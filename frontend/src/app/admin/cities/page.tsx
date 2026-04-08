"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CityForm from "@/components/admin/CityForm";
import CityTable from "@/components/admin/CityTable";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
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
      toast.error(message);
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
      toast.success("City created successfully.");
      await loadCities();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create city";
      toast.error(message);
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
      toast.success("City updated successfully.");
      setEditingCity(null);
      await loadCities();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update city";
      toast.error(message);
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
      toast.success("City deactivated successfully.");
      await loadCities();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to deactivate city";
      toast.error(message);
    }
  }

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <AdminHeader
            title="Cities"
            subtitle="Create, update, and manage supported cities."
          />

          <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
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
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  All Cities
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
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
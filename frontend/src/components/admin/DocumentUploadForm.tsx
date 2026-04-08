"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import type { City } from "@/lib/types";

type DocumentUploadFormProps = {
  cities: City[];
  loading?: boolean;
  onSubmit: (formData: FormData) => Promise<void> | void;
};

export default function DocumentUploadForm({
  cities,
  loading = false,
  onSubmit,
}: DocumentUploadFormProps) {
  const [cityId, setCityId] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!cityId || !title.trim() || !file) {
      return;
    }

    const formData = new FormData();
    formData.append("city_id", cityId);
    formData.append("title", title.trim());
    formData.append("file", file);

    await onSubmit(formData);

    setCityId("");
    setTitle("");
    setFile(null);

    const fileInput = document.getElementById(
      "document-file-input"
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          City
        </label>
        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          required
        >
          <option value="">Select a city</option>
          {cities
            .filter((city) => city.is_active)
            .map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Belleville Parking By-Law"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          PDF File
        </label>
        <input
          id="document-file-input"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-700 dark:text-gray-300"
          required
        />
      </div>

      <Button type="submit" loading={loading}>
        Upload Document
      </Button>
    </form>
  );
}
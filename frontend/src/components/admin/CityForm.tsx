"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

type CityFormValues = {
  name: string;
  slug: string;
  province: string;
  is_active: boolean;
};

type CityFormProps = {
  initialValues?: Partial<CityFormValues>;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (values: CityFormValues) => Promise<void> | void;
  onCancel?: () => void;
};

export default function CityForm({
  initialValues,
  submitLabel = "Save City",
  loading = false,
  onSubmit,
  onCancel,
}: CityFormProps) {
  const [name, setName] = useState(initialValues?.name || "");
  const [slug, setSlug] = useState(initialValues?.slug || "");
  const [province, setProvince] = useState(initialValues?.province || "");
  const [isActive, setIsActive] = useState(initialValues?.is_active ?? true);

  useEffect(() => {
    setName(initialValues?.name || "");
    setSlug(initialValues?.slug || "");
    setProvince(initialValues?.province || "");
    setIsActive(initialValues?.is_active ?? true);
  }, [initialValues]);

  function handleNameChange(value: string) {
    setName(value);

    if (!initialValues?.slug) {
      const generatedSlug = value.trim().toLowerCase().replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    await onSubmit({
      name: name.trim(),
      slug: slug.trim(),
      province: province.trim(),
      is_active: isActive,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <Input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Belleville"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Slug
        </label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="belleville"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Province
        </label>
        <Input
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          placeholder="Ontario"
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active
      </label>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
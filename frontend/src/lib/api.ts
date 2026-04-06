import type {
  AdminUser,
  ChatResponse,
  City,
  Document,
  LoginResponse,
  ProcessingJob,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Request failed");
  }

  return response.json();
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  return handleResponse<T>(response);
}

export async function adminApiFetch<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<T>(response);
}

export async function getCities() {
  return apiFetch<City[]>("/cities");
}

export async function askQuestion(payload: {
  city_id: number;
  question: string;
  top_k?: number;
}) {
  return apiFetch<ChatResponse>("/chat/ask", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginAdmin(payload: {
  email: string;
  password: string;
}) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentAdmin(token: string) {
  return adminApiFetch<AdminUser>("/admin/me", token);
}

export async function getAllCities(token: string) {
  return adminApiFetch<City[]>("/admin/cities", token);
}

export async function createCity(
  token: string,
  payload: {
    name: string;
    slug: string;
    province: string;
    is_active?: boolean;
  }
) {
  return adminApiFetch<City>("/cities", token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateCity(
  token: string,
  cityId: number,
  payload: Partial<{
    name: string;
    slug: string;
    province: string;
    is_active: boolean;
  }>
) {
  return adminApiFetch<City>(`/cities/${cityId}`, token, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function deactivateCity(token: string, cityId: number) {
  return adminApiFetch<City>(`/cities/${cityId}`, token, {
    method: "DELETE",
  });
}

export async function getDocuments(token: string, cityId?: number) {
  const path = cityId
    ? `/admin/documents?city_id=${cityId}`
    : "/admin/documents";
  return adminApiFetch<Document[]>(path, token);
}

export async function uploadDocument(token: string, formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/admin/documents/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse<Document>(response);
}

export async function createProcessingJobs(
  token: string,
  documentIds: number[]
) {
  return adminApiFetch<ProcessingJob[]>("/admin/jobs/process", token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ document_ids: documentIds }),
  });
}

export async function getJobs(
  token: string,
  filters?: { city_id?: number; document_id?: number }
) {
  const params = new URLSearchParams();

  if (filters?.city_id) params.set("city_id", String(filters.city_id));
  if (filters?.document_id) {
    params.set("document_id", String(filters.document_id));
  }

  const query = params.toString();
  const path = query ? `/admin/jobs?${query}` : "/admin/jobs";

  return adminApiFetch<ProcessingJob[]>(path, token);
}

export async function runNextJob(token: string) {
  return adminApiFetch<ProcessingJob>("/admin/processing/run-next", token, {
    method: "POST",
  });
}
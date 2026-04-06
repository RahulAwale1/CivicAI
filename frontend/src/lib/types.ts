export type City = {
  id: number;
  name: string;
  slug: string;
  province: string;
  is_active: boolean;
  created_at: string;
};

export type Document = {
  id: number;
  city_id: number;
  title: string;
  original_filename: string;
  s3_key: string;
  status: "uploaded" | "queued" | "processing" | "processed" | "failed";
  uploaded_by: number | null;
  uploaded_at: string;
  updated_at: string;
};

export type ProcessingJob = {
  id: number;
  document_id: number;
  city_id: number;
  status: "queued" | "running" | "completed" | "failed";
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  triggered_by: number | null;
  created_at: string;
};

export type Citation = {
  document_id: number;
  title: string;
  page_number: number | null;
  chunk_index: number;
};

export type ChatResponse = {
  answer: string;
  citations: Citation[];
};

export type AdminUser = {
  id: number;
  email: string;
  created_at: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};
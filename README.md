# CivicAI

CivicAI is an AI-powered municipal by-law assistant with separate admin and public interfaces. Admins can create cities, upload and process city-specific by-law PDFs, and users can ask natural-language questions and receive citation-grounded answers.

## Features

- City management with create, update, and deactivate flows
- Admin-authenticated PDF upload to AWS S3
- Batch processing job creation and tracking
- PDF text extraction with OCR fallback for scanned documents
- Chunking + OpenAI embeddings stored in PostgreSQL with pgvector
- Public chat page with city-scoped semantic retrieval
- Grouped citations with secure Open PDF links

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy
- Database: PostgreSQL + pgvector
- Storage: AWS S3
- AI: OpenAI embeddings + chat completions
- OCR: Tesseract, pdf2image
- Infra: Docker, Docker Compose

## Architecture

```text
Next.js frontend
    ↓
FastAPI backend
    ↓
PostgreSQL + pgvector
    ↓
AWS S3
    ↓
OpenAI
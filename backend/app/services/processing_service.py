import io
from datetime import datetime, timezone

from pypdf import PdfReader
from sqlalchemy.orm import Session

from app.db.models.chunk import Chunk
from app.db.models.document import Document
from app.db.models.enums import DocumentStatus, JobStatus
from app.db.models.job import ProcessingJob
from app.services.chunking_service import chunk_text
from app.services.s3_service import s3_service


def extract_text_by_page(pdf_bytes: bytes) -> list[tuple[int, str]]:
    page_texts = []
    pdf_stream = io.BytesIO(pdf_bytes)
    reader = PdfReader(pdf_stream)

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        page_texts.append((page_number, text))

    return page_texts


def process_job(job_id: int, db: Session) -> ProcessingJob:
    job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()

    if not job:
        raise ValueError(f"Job {job_id} not found")

    document = db.query(Document).filter(Document.id == job.document_id).first()

    if not document:
        raise ValueError(f"Document {job.document_id} not found")

    try:
        job.status = JobStatus.running
        job.started_at = datetime.now(timezone.utc)
        document.status = DocumentStatus.processing
        db.commit()

        pdf_bytes = s3_service.download_file_bytes(document.s3_key)

        page_texts = extract_text_by_page(pdf_bytes)

        db.query(Chunk).filter(Chunk.document_id == document.id).delete()
        db.commit()

        for page_number, page_text in page_texts:
            chunks = chunk_text(page_text)

            for idx, chunk in enumerate(chunks):
                db_chunk = Chunk(
                    document_id=document.id,
                    city_id=document.city_id,
                    page_number=page_number,
                    chunk_index=idx,
                    text=chunk,
                )
                db.add(db_chunk)

        document.status = DocumentStatus.processed
        job.status = JobStatus.completed
        job.completed_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(job)

        return job

    except Exception as e:
        db.rollback()

        job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()

        if job:
            job.status = JobStatus.failed
            job.error_message = str(e)
            job.completed_at = datetime.now(timezone.utc)

        document = db.query(Document).filter(Document.id == job.document_id).first()
        if document:
            document.status = DocumentStatus.failed

        db.commit()
        db.refresh(job)

        return job
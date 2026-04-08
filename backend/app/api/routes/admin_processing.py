from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.db.models.admin import Admin
from app.db.models.enums import JobStatus
from app.db.models.job import ProcessingJob
from app.schemas.job import ProcessingJobResponse
from app.tasks.document_tasks import process_document_job
from app.db.models.document import Document
from app.db.models.enums import DocumentStatus, JobStatus
from app.db.models.job import ProcessingJob

router = APIRouter(prefix="/admin/processing", tags=["Admin Processing"])


@router.post("/jobs/{job_id}/run", response_model=dict)
def run_processing_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing job not found"
        )

    process_document_job.delay(job.id)

    return {
        "message": "Job enqueued successfully",
        "job_id": job.id,
    }


@router.post("/run-next", response_model=dict)
def run_next_queued_job(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    job = (
        db.query(ProcessingJob)
        .filter(ProcessingJob.status == JobStatus.queued)
        .order_by(ProcessingJob.created_at.asc())
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No queued jobs found"
        )

    document = (
        db.query(Document)
        .filter(Document.id == job.document_id)
        .first()
    )

    job.status = JobStatus.running
    if document:
        document.status = DocumentStatus.processing

    db.commit()

    process_document_job.delay(job.id)

    return {
        "message": "Job enqueued successfully",
        "job_id": job.id,
    }


@router.post("/run-all", response_model=dict)
def run_all_queued_jobs(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    jobs = (
        db.query(ProcessingJob)
        .filter(ProcessingJob.status == JobStatus.queued)
        .order_by(ProcessingJob.created_at.asc())
        .all()
    )

    if not jobs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No queued jobs found"
        )

    job_ids = []

    for job in jobs:
        document = (
            db.query(Document)
            .filter(Document.id == job.document_id)
            .first()
        )

        job.status = JobStatus.running
        if document:
            document.status = DocumentStatus.processing

        job_ids.append(job.id)

    db.commit()

    for job_id in job_ids:
        process_document_job.delay(job_id)

    return {
        "message": f"{len(job_ids)} jobs enqueued successfully",
        "job_ids": job_ids,
        "count": len(job_ids),
    }
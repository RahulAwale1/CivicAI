from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.db.models.admin import Admin
from app.db.models.enums import JobStatus
from app.db.models.job import ProcessingJob
from app.schemas.job import ProcessingJobResponse
from app.services.processing_service import process_job

router = APIRouter(prefix="/admin/processing", tags=["Admin Processing"])


@router.post("/jobs/{job_id}/run", response_model=ProcessingJobResponse)
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

    updated_job = process_job(job_id=job_id, db=db)
    return updated_job


@router.post("/run-next", response_model=ProcessingJobResponse)
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

    updated_job = process_job(job_id=job.id, db=db)
    return updated_job
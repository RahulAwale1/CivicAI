from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.db.models.admin import Admin
from app.db.models.city import City
from app.db.models.document import Document
from app.db.models.enums import DocumentStatus, JobStatus
from app.db.models.job import ProcessingJob

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    total_cities = db.query(City).count()
    active_cities = db.query(City).filter(City.is_active == True).count()  # noqa: E712

    total_documents = db.query(Document).count()
    uploaded_documents = (
        db.query(Document)
        .filter(Document.status == DocumentStatus.uploaded)
        .count()
    )
    queued_documents = (
        db.query(Document)
        .filter(Document.status == DocumentStatus.queued)
        .count()
    )
    processing_documents = (
        db.query(Document)
        .filter(Document.status == DocumentStatus.processing)
        .count()
    )
    processed_documents = (
        db.query(Document)
        .filter(Document.status == DocumentStatus.processed)
        .count()
    )
    failed_documents = (
        db.query(Document)
        .filter(Document.status == DocumentStatus.failed)
        .count()
    )

    total_jobs = db.query(ProcessingJob).count()
    queued_jobs = (
        db.query(ProcessingJob)
        .filter(ProcessingJob.status == JobStatus.queued)
        .count()
    )
    running_jobs = (
        db.query(ProcessingJob)
        .filter(ProcessingJob.status == JobStatus.running)
        .count()
    )
    completed_jobs = (
        db.query(ProcessingJob)
        .filter(ProcessingJob.status == JobStatus.completed)
        .count()
    )
    failed_jobs = (
        db.query(ProcessingJob)
        .filter(ProcessingJob.status == JobStatus.failed)
        .count()
    )

    return {
        "cities": {
            "total": total_cities,
            "active": active_cities,
        },
        "documents": {
            "total": total_documents,
            "uploaded": uploaded_documents,
            "queued": queued_documents,
            "processing": processing_documents,
            "processed": processed_documents,
            "failed": failed_documents,
        },
        "jobs": {
            "total": total_jobs,
            "queued": queued_jobs,
            "running": running_jobs,
            "completed": completed_jobs,
            "failed": failed_jobs,
        },
    }
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.db.models.admin import Admin
from app.db.models.document import Document
from app.db.models.enums import DocumentStatus, JobStatus
from app.db.models.job import ProcessingJob
from app.schemas.job import BatchProcessRequest, ProcessingJobResponse

router = APIRouter(prefix="/admin/jobs", tags=["Admin Jobs"])


@router.post("/process", response_model=list[ProcessingJobResponse], status_code=status.HTTP_201_CREATED)
def create_processing_jobs(
    payload: BatchProcessRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    if not payload.document_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No document IDs provided"
        )

    documents = (
        db.query(Document)
        .filter(Document.id.in_(payload.document_ids))
        .all()
    )

    found_ids = {doc.id for doc in documents}
    missing_ids = [doc_id for doc_id in payload.document_ids if doc_id not in found_ids]

    if missing_ids:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Documents not found: {missing_ids}"
        )

    jobs_created = []

    for document in documents:
        if document.status in [DocumentStatus.processing, DocumentStatus.queued]:
            continue

        existing_active_job = (
            db.query(ProcessingJob)
            .filter(
                ProcessingJob.document_id == document.id,
                ProcessingJob.status.in_([JobStatus.queued, JobStatus.running])
            )
            .first()
        )

        if existing_active_job:
            continue

        job = ProcessingJob(
            document_id=document.id,
            city_id=document.city_id,
            status=JobStatus.queued,
            triggered_by=current_admin.id
        )

        document.status = DocumentStatus.queued

        db.add(job)
        jobs_created.append(job)

    db.commit()

    for job in jobs_created:
        db.refresh(job)

    return jobs_created


@router.get("/", response_model=list[ProcessingJobResponse])
def list_processing_jobs(
    document_id: int | None = None,
    city_id: int | None = None,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    query = db.query(ProcessingJob)

    if document_id is not None:
        query = query.filter(ProcessingJob.document_id == document_id)

    if city_id is not None:
        query = query.filter(ProcessingJob.city_id == city_id)

    return query.order_by(ProcessingJob.created_at.desc()).all()
from app.core.celery_app import celery_app
from app.db.database import SessionLocal
from app.services.processing_service import process_job


@celery_app.task(name="process_document_job")
def process_document_job(job_id: int):
    db = SessionLocal()
    try:
        process_job(job_id=job_id, db=db)
    finally:
        db.close()
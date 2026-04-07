from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.document import Document
from app.services.s3_service import s3_service

router = APIRouter(prefix="/documents", tags=["Document Links"])


@router.get("/{document_id}/link")
def get_document_link(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )

    url = s3_service.generate_presigned_url(document.s3_key)

    return {
        "document_id": document.id,
        "title": document.title,
        "url": url,
    }
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.db.models.admin import Admin
from app.db.models.city import City
from app.db.models.document import Document
from app.db.models.enums import DocumentStatus
from app.schemas.document import DocumentResponse
from app.services.s3_service import s3_service

router = APIRouter(prefix="/admin/documents", tags=["Admin Documents"])


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    city_id: int = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    city = db.query(City).filter(City.id == city_id, City.is_active == True).first()  # noqa: E712
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active city not found"
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )

    s3_key = s3_service.generate_s3_key(city.slug, file.filename)

    try:
        s3_service.upload_fileobj(
            file_obj=file.file,
            s3_key=s3_key,
            content_type=file.content_type
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file to S3: {str(e)}"
        )

    db_document = Document(
        city_id=city.id,
        title=title.strip(),
        original_filename=file.filename,
        s3_key=s3_key,
        status=DocumentStatus.uploaded,
        uploaded_by=current_admin.id,
    )

    db.add(db_document)
    db.commit()
    db.refresh(db_document)

    return db_document


@router.get("/", response_model=list[DocumentResponse])
def list_documents(
    city_id: int | None = None,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    query = db.query(Document)

    if city_id is not None:
        query = query.filter(Document.city_id == city_id)

    return query.order_by(Document.uploaded_at.desc()).all()
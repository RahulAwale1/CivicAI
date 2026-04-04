from datetime import datetime

from pydantic import BaseModel

from app.db.models.enums import DocumentStatus


class DocumentResponse(BaseModel):
    id: int
    city_id: int
    title: str
    original_filename: str
    s3_key: str
    status: DocumentStatus
    uploaded_by: int | None
    uploaded_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
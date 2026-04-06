from datetime import datetime
from pydantic import BaseModel

from app.db.models.enums import JobStatus


class BatchProcessRequest(BaseModel):
    document_ids: list[int]


class ProcessingJobResponse(BaseModel):
    id: int
    document_id: int
    city_id: int
    status: JobStatus
    started_at: datetime | None
    completed_at: datetime | None
    error_message: str | None
    triggered_by: int | None
    created_at: datetime

    class Config:
        from_attributes = True
from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    uploaded_documents = relationship(
        "Document",
        back_populates="uploaded_by_admin",
        foreign_keys="Document.uploaded_by"
    )

    triggered_jobs = relationship(
        "ProcessingJob",
        back_populates="triggered_by_admin",
        foreign_keys="ProcessingJob.triggered_by"
    )
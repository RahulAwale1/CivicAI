from fastapi import APIRouter
from sqlalchemy import text

from app.db.database import SessionLocal

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.get("/health/db")
def db_health_check():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    finally:
        db.close()
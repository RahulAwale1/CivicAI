from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db.database import get_db
from app.db.models.admin import Admin
from app.schemas.auth import AdminCreate, AdminResponse

router = APIRouter(prefix="/admin/setup", tags=["Admin Setup"])


@router.post("/", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
def create_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    existing_admin = db.query(Admin).filter(Admin.email == admin.email).first()

    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin with this email already exists"
        )

    try:
        hashed = hash_password(admin.password)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    db_admin = Admin(
        email=admin.email,
        hashed_password=hashed
    )

    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)

    return db_admin
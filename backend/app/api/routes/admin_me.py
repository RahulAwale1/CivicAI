from fastapi import APIRouter, Depends

from app.api.deps import get_current_admin
from app.db.models.admin import Admin
from app.schemas.auth import AdminResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/me", response_model=AdminResponse)
def get_me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin
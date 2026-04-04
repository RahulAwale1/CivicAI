from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CityBase(BaseModel):
    name: str
    slug: str
    province: str
    is_active: bool = True


class CityCreate(CityBase):
    pass


class CityUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    province: Optional[str] = None
    is_active: Optional[bool] = None


class CityResponse(CityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
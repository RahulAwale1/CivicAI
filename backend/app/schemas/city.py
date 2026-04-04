from datetime import datetime

from pydantic import BaseModel


class CityBase(BaseModel):
    name: str
    slug: str
    province: str
    is_active: bool = True


class CityCreate(CityBase):
    pass


class CityResponse(CityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
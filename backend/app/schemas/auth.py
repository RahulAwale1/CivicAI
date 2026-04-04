from datetime import datetime

from pydantic import BaseModel, EmailStr


class AdminCreate(BaseModel):
    email: EmailStr
    password: str


class AdminResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
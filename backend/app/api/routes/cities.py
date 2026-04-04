from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.city import City
from app.schemas.city import CityCreate, CityResponse

router = APIRouter(prefix="/cities", tags=["Cities"])


@router.post("/", response_model=CityResponse, status_code=status.HTTP_201_CREATED)
def create_city(city: CityCreate, db: Session = Depends(get_db)):
    existing_city = db.query(City).filter(
        (City.name == city.name) | (City.slug == city.slug)
    ).first()

    if existing_city:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="City with the same name or slug already exists"
        )

    db_city = City(
        name=city.name,
        slug=city.slug,
        province=city.province,
        is_active=city.is_active
    )

    db.add(db_city)
    db.commit()
    db.refresh(db_city)

    return db_city


@router.get("/", response_model=list[CityResponse])
def list_cities(db: Session = Depends(get_db)):
    return db.query(City).order_by(City.name.asc()).all()
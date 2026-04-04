from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.database import get_db
from app.db.models.admin import Admin
from app.db.models.city import City
from app.schemas.city import CityCreate, CityResponse, CityUpdate

router = APIRouter(tags=["Cities"])


@router.post("/cities", response_model=CityResponse, status_code=status.HTTP_201_CREATED)
def create_city(
    city: CityCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    normalized_slug = city.slug.strip().lower()
    normalized_name = city.name.strip().capitalize()

    existing_city = db.query(City).filter(
        (City.name == normalized_name) | (City.slug == normalized_slug)
    ).first()

    if existing_city:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="City with the same name or slug already exists"
        )

    db_city = City(
        name=normalized_name,
        slug=normalized_slug,
        province=city.province.strip().capitalize(),
        is_active=city.is_active
    )

    db.add(db_city)
    db.commit()
    db.refresh(db_city)

    return db_city


@router.get("/cities", response_model=list[CityResponse])
def list_active_cities(db: Session = Depends(get_db)):
    return (
        db.query(City)
        .filter(City.is_active == True)
        .order_by(City.name.asc())
        .all()
    )


@router.get("/admin/cities", response_model=list[CityResponse])
def list_all_cities(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return db.query(City).order_by(City.name.asc()).all()


@router.patch("/cities/{city_id}", response_model=CityResponse)
def update_city(
    city_id: int,
    city_update: CityUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    db_city = db.query(City).filter(City.id == city_id).first()

    if not db_city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="City not found"
        )

    if city_update.name is not None:
        normalized_name = city_update.name.strip().capitalize()

        existing_name_city = db.query(City).filter(
            City.name == normalized_name,
            City.id != city_id
        ).first()

        if existing_name_city:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Another city with this name already exists"
            )

        db_city.name = normalized_name

    if city_update.slug is not None:
        normalized_slug = city_update.slug.strip().lower()

        existing_slug_city = db.query(City).filter(
            City.slug == normalized_slug,
            City.id != city_id
        ).first()

        if existing_slug_city:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Another city with this slug already exists"
            )

        db_city.slug = normalized_slug

    if city_update.province is not None:
        db_city.province = city_update.province.strip().capitalize()

    if city_update.is_active is not None:
        db_city.is_active = city_update.is_active

    db.commit()
    db.refresh(db_city)

    return db_city


@router.delete("/cities/{city_id}", response_model=CityResponse)
def soft_delete_city(
    city_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    db_city = db.query(City).filter(City.id == city_id).first()

    if not db_city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="City not found"
        )

    db_city.is_active = False

    db.commit()
    db.refresh(db_city)

    return db_city
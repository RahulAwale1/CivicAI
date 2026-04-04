from fastapi import FastAPI

from app.api.routes.admin_me import router as admin_me_router
from app.api.routes.admin_setup import router as admin_setup_router
from app.api.routes.auth import router as auth_router
from app.api.routes.cities import router as cities_router
from app.api.routes.health import router as health_router
from app.core.config import settings
from app.db.database import Base, engine
from app.db.models import Admin, City, Chunk, Document, ProcessingJob  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.include_router(health_router)
app.include_router(cities_router)
app.include_router(admin_setup_router)
app.include_router(auth_router)
app.include_router(admin_me_router)


@app.get("/")
def root():
    return {
        "message": "CivicAI backend is running"
    }
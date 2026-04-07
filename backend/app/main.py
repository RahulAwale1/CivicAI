from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.admin_documents import router as admin_documents_router
from app.api.routes.admin_jobs import router as admin_jobs_router
from app.api.routes.admin_me import router as admin_me_router
from app.api.routes.admin_processing import router as admin_processing_router
from app.api.routes.admin_setup import router as admin_setup_router
from app.api.routes.document_links import router as document_links_router
from app.api.routes.auth import router as auth_router
from app.api.routes.chat import router as chat_router
from app.api.routes.cities import router as cities_router
from app.api.routes.health import router as health_router
from app.api.routes.admin_dashboard import router as admin_dashboard_router
from app.core.config import settings
from app.db.database import Base, engine
from app.db.models import Admin, City, Chunk, Document, ProcessingJob  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://your-frontend-domain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(cities_router)
app.include_router(admin_setup_router)
app.include_router(auth_router)
app.include_router(admin_me_router)
app.include_router(admin_documents_router)
app.include_router(admin_jobs_router)
app.include_router(admin_processing_router)
app.include_router(chat_router)
app.include_router(document_links_router)
app.include_router(admin_dashboard_router)


@app.get("/")
def root():
    return {
        "message": "CivicAI backend is running"
    }
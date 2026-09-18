from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.api import auth, users, schemes, admin, affordability, documents, feedback

# Import all models so SQLAlchemy knows them
from app.models import (  # noqa: F401
    User,
    Profile,
    Scheme,
    UserDocument,
    RecommendationFeedback,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Vettri Scheme Matching API",
    version="0.2.0",
    description="Backend for Vettri — with enhanced matching and feedback.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(schemes.router)
app.include_router(admin.router)
app.include_router(affordability.router)
app.include_router(documents.router)
app.include_router(feedback.router)


@app.get("/api/v1/health")
def health():
    return {"status": "ok", "service": "vettri-backend"}
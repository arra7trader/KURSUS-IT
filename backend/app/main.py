# Data Academy - FastAPI Backend

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import grade, tutor, health

app = FastAPI(
    title="Data Academy API",
    description="AI-driven LMS Backend for Data Analysts and Data Scientists",
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router, tags=["Health"])
app.include_router(tutor.router, prefix="/api/tutor", tags=["AI Tutor"])
app.include_router(grade.router, prefix="/api/grade", tags=["Code Grading"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to Data Academy API",
        "docs": "/docs",
        "personas": {
            "RENDY": "Data Analyst Tutor",
            "ABDUL": "Data Scientist Tutor"
        }
    }

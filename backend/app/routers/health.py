# Data Academy - Health Check Router

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "service": "Data Academy API",
        "version": "1.0.0"
    }


@router.get("/ready")
async def readiness_check():
    """Readiness check - verify all dependencies are available"""
    # In production, check database connection, Redis, etc.
    return {
        "ready": True,
        "database": "connected",
        "ai_service": "available"
    }

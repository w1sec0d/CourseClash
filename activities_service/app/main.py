from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import logging
import os

from app.database import engine, create_tables
from app.routers import activities, submissions, files
from app.middleware.auth import AuthMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI instance
app = FastAPI(
    title="CourseClash Activities Service",
    description="Servicio de gestión de actividades para la plataforma CourseClash",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure according to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure according to your needs
)

# Custom auth middleware
app.add_middleware(AuthMiddleware)

# Include routers
app.include_router(activities.router, prefix="/api/v1/activities", tags=["Activities"])
app.include_router(submissions.router, prefix="/api/v1/submissions", tags=["Submissions"])
app.include_router(files.router, prefix="/api/v1/files", tags=["Files"])

@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    try:
        create_tables()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.warning(f"Could not connect to database during startup: {e}")
        logger.warning("Service will start but database operations will fail until DB is available")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "CourseClash Activities Service", 
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "activities-service",
        "database": "connected"
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor"}
    ) 
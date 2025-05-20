from fastapi import FastAPI
from . import models
from .database import engine
from .routers import user, course, activity

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Course Service",
    description="Course service for CourseClash",
    version="0.1.0",
)

# Include routers
app.include_router(course.router)
app.include_router(activity.router)
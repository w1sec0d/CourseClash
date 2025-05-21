# from fastapi import FastAPI
# from . import models
# from .database import engine
# from .routers import user, course, activity

# # Create database tables
# models.Base.metadata.create_all(bind=engine)

# app = FastAPI(
#     title="Course Service",
#     description="Course service for CourseClash",
#     version="0.1.0",
# )

# # Include routers
# app.include_router(course.router)
# app.include_router(activity.router)

import uvicorn
from fastapi import FastAPI
from .routers.courses import router as courses_router


# Importacion de la base de datos
from .db import get_db


# Creación del microservicio de cursos
app = FastAPI(
    title="CourseClash course service", 
    description="API for course management of courseClash"
    )

# Rutas de servicios de los cursos
app.include_router(courses_router)

# Punto de entrada del microservicio
if __name__ == "__main__":
    uvicorn.run("app.main:app", host = "0.0.0.0", port = 8001)
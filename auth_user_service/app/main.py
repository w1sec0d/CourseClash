import uvicorn
from fastapi import FastAPI
from .routers.auth import router as auth_router
from .routers.users import router as users_router
from sqlalchemy import text
from .db import get_db

app = FastAPI(title="CourseClash Auth Service", 
              description="API for CourseClash authentication and user management")

app.include_router(auth_router)
app.include_router(users_router)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host = "0.0.0.0", port = 8000)
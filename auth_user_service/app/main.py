import uvicorn
from fastapi import FastAPI
from .routers.auth import router as auth_router
from .routers.users import router as users_router
from .routers.register import router as register_router

# Importacion de la base de datos
from .db import get_db

# Creación del microservicio de autenticación
app = FastAPI(title="CourseClash Auth Service", 
              description="API for CourseClash authentication and user management")




# Rutas de autenticación y usuarios
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(register_router)


# Punto de entrada del microservicio
if __name__ == "__main__":
    uvicorn.run("app.main:app", host = "0.0.0.0", port = 8000)
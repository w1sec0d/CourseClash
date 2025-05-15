# from fastapi import FastAPI, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy.orm import Session

# from .core.config import settings
# from .db import engine, Base, get_db
# from .routers import auth, users

# # Crear tablas en la base de datos
# Base.metadata.create_all(bind=engine)

# # Inicializar la aplicación FastAPI
# app = FastAPI(
#     title=settings.PROJECT_NAME,
#     openapi_url=f"{settings.API_V1_STR}/openapi.json",
#     debug=settings.DEBUG
# )

# # Configurar CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.CORS_ORIGINS,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Incluir routers
# app.include_router(auth.router, prefix=settings.API_V1_STR)
# app.include_router(users.router, prefix=settings.API_V1_STR)

# @app.get("/")
# def read_root():
#     return {"message": "Bienvenido al servicio de autenticación y usuarios de CourseClash"}

# @app.get("/health")
# def health_check():
#     return {"status": "ok", "service": "auth_user_service"}

import uvicorn
from fastapi import Depends, HTTPException, FastAPI,  status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

from typing import Dict, Any
from .core.security import verify_token, get_user_info_from_auth0

tokenHeader = HTTPBearer()


load_dotenv()

app = FastAPI(title="CourseClash Auth Service", 
              description="API for CourseClash authentication and user management")


@app.get("/Segurity")
def seguridad(payload: dict = Depends(verify_token)):
    print(payload)
    return {"message": "Bienvenido al servicio de autenticación y usuarios de CourseClash"}

@app.get("/me", response_model= Dict[str, Any])
def get_current_user_info(credentials: HTTPAuthorizationCredentials = Depends(tokenHeader)) -> Dict[str, Any]:
    """Endpoint para obtener la información del usuario actual"""

    try:
        payload = verify_token(credentials)
        print(payload)
        token = credentials.credentials

        user_info = get_user_info_from_auth0(token)
        return user_info

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"No se pudo obtener información del usuario: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )
        



if __name__ == "__main__":
    uvicorn.run("app.main:app", host = "0.0.0.0", port = 8000)


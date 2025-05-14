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
import os
from fastapi import Depends, FastAPI, Response, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import PyJWKClient
from dotenv import load_dotenv


tokenHeader = HTTPBearer()



app = FastAPI(title="CourseClash Auth Service", 
              description="API for CourseClash authentication and user management")



def verify_token(credentials: HTTPAuthorizationCredentials = Depends(tokenHeader)): 
    try: 
        AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks_client = PyJWKClient(jwks_url)

        token = credentials.credentials

        signing_key = jwks_client.get_signing_key_from_jwt(token).key

        payload = jwt.decode(
            token,
            signing_key,
            algorithms=[os.environ['AUTH0_ALGORITHMS']],
            audience=os.environ['AUTH0_API_AUDIENCE'],
            issuer=f"https://{os.environ['AUTH0_DOMAIN']}/"

        )
        return payload
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

@app.get("/Segurity")
def seguridad(payload: dict = Depends(verify_token)):
    return {"message": "Bienvenido al servicio de autenticación y usuarios de CourseClash"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host = "0.0.0.0", port = 8000)


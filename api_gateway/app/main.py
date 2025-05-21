"""
API Gateway para CourseClash

Punto de entrada principal de la API Gateway de CourseClash.

Este módulo configura y lanza la aplicación FastAPI, incluyendo:
- Rutas de la API
- Middlewares
- Manejo de errores
- Integración con GraphQL

Estructura:
- /api/*: Endpoints REST para autenticación, cursos y duelos
- /graphql: Endpoint GraphQL para consultas más complejas
- /health: Endpoint de verificación de estado del servicio
"""

import os
from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from strawberry.fastapi import GraphQLRouter
import httpx

# Configuración de logging
from app.core.logger import logger, setup_logger
from app.core.middleware import setup_middlewares

# Importar routers
from app.routers import auth, courses, duels

# Importar esquema de GraphQL
from app.graphql.schema import schema

# Configurar el logger
logger = setup_logger("courseclash.api")

# Crear la aplicación FastAPI
app = FastAPI(
    title="CourseClash API Gateway",
    description="API Gateway for CourseClash platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configurar middlewares personalizados
setup_middlewares(app)

# Configuración de CORS (Intercambio de Recursos de Origen Cruzado)
# Solo permite solicitudes desde localhost para mayor seguridad
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # localhost in general
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:3000",  # React dev server
        "http://127.0.0.1:3000",  # React dev server alternative
        "http://localhost:8001",  # Auth User Service
        "http://127.0.0.1:8001"  # Auth User Service alternative
        "http://localhost:8002",  # Duel Service
        "http://127.0.0.1:8002"  # Duel Service alternative
        "http://localhost:8003",  # Course Service
        "http://127.0.0.1:8003",  # Course Service alternative
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Endpoint de GraphQL
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/api/graphql")

# Incluir routers REST de cada servicio
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(duels.router, prefix="/api/duels", tags=["duels"])


# Rutas de la API Gateway para revisar que todo esta bien
@app.get("/", tags=["root"])
async def root():
    return {"message": "Welcome to CourseClash API Gateway"}


@app.get("/health", tags=["health"])
async def health():
    return {"status": "healthy"}


# Manejadores de errores HTTP
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Maneja las excepciones HTTP lanzadas por FastAPI.

    Registra el error y devuelve una respuesta JSON estandarizada.
    """
    # Registrar el error
    logger.error(
        f"Error HTTP {exc.status_code}: {exc.detail}",
        extra={
            "status_code": exc.status_code,
            "path": request.url.path,
            "method": request.method,
            "error_detail": exc.detail,
        },
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


# Manejador global de excepciones
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Captura cualquier excepción no manejada en la aplicación.

    Registra el error con información detallada y devuelve una respuesta 500.
    """
    # Registrar el error con información detallada
    logger.exception(
        "Excepción no manejada en la aplicación",
        extra={
            "path": request.url.path,
            "method": request.method,
            "error": str(exc),
            "error_type": type(exc).__name__,
        },
        exc_info=True,
    )

    # En producción, evitar exponer detalles internos del error
    error_detail = "Internal server error"
    if os.getenv("DEBUG", "false").lower() == "true":
        error_detail = f"{type(exc).__name__}: {str(exc)}"

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": error_detail},
    )

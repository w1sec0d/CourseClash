"""
API Gateway para CourseClash

Punto de entrada principal de la API Gateway de CourseClash.

Este módulo configura y lanza la aplicación FastAPI, incluyendo:
- Configuración de GraphQL
- Middlewares
- Manejo de errores

Estructura:
- /api/graphql: Endpoint GraphQL para todas las operaciones
- /health: Endpoint de verificación de estado del servicio
"""

import os
from typing import Any, Dict

# Configuración de logging
from app.core.logger import logger, setup_logger
from app.core.middleware import setup_middlewares

# Importar esquema de GraphQL
from app.graphql.schema import schema
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from strawberry.fastapi import GraphQLRouter

# Configurar el logger
logger = setup_logger("courseclash.api")

# Crear la aplicación FastAPI
app = FastAPI(
    title="CourseClash API Gateway",
    description="""
    API Gateway para la plataforma CourseClash.
    
    Este servicio actúa como punto de entrada único para todas las operaciones
    de la plataforma, proporcionando una interfaz GraphQL unificada.
    
    ## Características Principales
    
    - **Autenticación**: Gestión de usuarios, login, registro y tokens
    - **Cursos**: Creación y gestión de cursos educativos
    - **Duelos**: Sistema de desafíos entre estudiantes
    
    ## Ejemplos de Uso GraphQL
    
    ### Autenticación
    ```graphql
    mutation Login {
      login(email: "usuario@ejemplo.com", password: "contraseña") {
        user {
          id
          username
          email
        }
        token
        refreshToken
      }
    }
    ```
    
    ### Cursos
    ```graphql
    query GetCourses {
      getCourses {
        id
        title
        description
        level
        category
      }
    }
    ```
    
    ### Duelos
    ```graphql
    mutation CreateDuel {
      createDuel(
        title: "Desafío de Matemáticas"
        description: "Resuelve estos problemas"
      ) {
        id
        title
        status
      }
    }
    ```
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "CourseClash Team",
        "url": "https://courseclash.com/contact",
        "email": "support@courseclash.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Configurar middlewares personalizados
setup_middlewares(app)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8001",
        "http://127.0.0.1:8001",
        "http://localhost:8002",
        "http://127.0.0.1:8002",
        "http://localhost:8003",
        "http://127.0.0.1:8003",
        "http://localhost:8004",
        "http://127.0.0.1:8004",
        "http://cc_fe:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint de GraphQL
graphql_app = GraphQLRouter(
    schema,
    path="/",  # Cambiado de "/api/graphql" a "/"
    graphiql=True,  # Habilita GraphiQL para desarrollo
)

app.include_router(
    graphql_app,
    prefix="/api/graphql",  # El prefijo ya incluye la ruta completa
    tags=["GraphQL"],
    responses={
        200: {
            "description": "Operación GraphQL exitosa",
            "content": {
                "application/json": {
                    "example": {
                        "data": {
                            "getCourses": [
                                {
                                    "id": "1",
                                    "title": "Matemáticas Básicas",
                                    "description": "Curso introductorio",
                                    "level": "BEGINNER",
                                    "category": "MATH",
                                }
                            ]
                        }
                    }
                }
            },
        },
        400: {
            "description": "Error en la consulta GraphQL",
            "content": {
                "application/json": {
                    "example": {
                        "errors": [
                            {
                                "message": "Invalid query",
                                "locations": [{"line": 1, "column": 1}],
                            }
                        ]
                    }
                }
            },
        },
    },
)


# Rutas de la API Gateway para revisar que todo esta bien
@app.get(
    "/",
    tags=["root"],
    summary="Bienvenida",
    description="Endpoint de bienvenida que confirma que el API Gateway está funcionando",
    response_model=Dict[str, str],
    responses={
        200: {
            "description": "Mensaje de bienvenida",
            "content": {
                "application/json": {
                    "example": {"message": "Welcome to CourseClash API Gateway"}
                }
            },
        }
    },
)
async def root():
    """
    Endpoint de bienvenida que confirma que el API Gateway está funcionando.

    Returns:
        Dict[str, str]: Mensaje de bienvenida
    """
    return {"message": "Welcome to CourseClash API Gateway"}


@app.get(
    "/health",
    tags=["health"],
    summary="Estado del Servicio",
    description="Verifica el estado de salud del API Gateway",
    response_model=Dict[str, str],
    responses={
        200: {
            "description": "Estado del servicio",
            "content": {"application/json": {"example": {"status": "healthy"}}},
        }
    },
)
async def health():
    """
    Verifica el estado de salud del API Gateway.

    Returns:
        Dict[str, str]: Estado del servicio
    """
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

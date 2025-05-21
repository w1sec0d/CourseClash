"""
Módulo de autenticación para CourseClash API Gateway

Este módulo proporciona endpoints para la gestión de autenticación de usuarios,
incluyendo registro, inicio de sesión, renovación de tokens y validación de identidad.

Endpoints disponibles:
- POST /login: Autentica un usuario y devuelve tokens de acceso
- POST /register: Registra un nuevo usuario en el sistema
- POST /refresh: Renueva los tokens de acceso usando un refresh token
- POST /logout: Cierra la sesión del usuario
- GET /me: Obtiene la información del usuario autenticado

"""

from datetime import datetime
from enum import Enum
from fastapi import APIRouter, HTTPException, Header, status
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict, Any
import httpx
import os

# Environment variables
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth_user_service:8000")

# Configuración del router
router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "No autorizado - Credenciales inválidas o faltantes"
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Prohibido - No tiene permisos para acceder al recurso"
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "No encontrado - El recurso solicitado no existe"
        },
    },
)


class UserRole(str, Enum):
    """Roles de usuario disponibles en el sistema."""

    STUDENT = "STUDENT"
    TEACHER = "TEACHER"
    ADMIN = "ADMIN"


class TokenData(BaseModel):
    """Modelo para los datos del token."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 3600


class UserBase(BaseModel):
    """Modelo base para usuarios."""

    username: str = Field(..., min_length=3, max_length=50, example="usuario123")
    email: EmailStr = Field(..., example="usuario@example.com")
    name: Optional[str] = Field(None, max_length=100, example="Juan Pérez")
    role: UserRole = Field(default=UserRole.STUDENT, example="STUDENT")


class UserCreate(BaseModel):
    """Modelo para la creación de un nuevo usuario."""

    username: str = Field(..., min_length=3, max_length=50, example="usuario123")
    email: EmailStr = Field(..., example="usuario@example.com")
    password: str = Field(..., min_length=6, example="password123")
    full_name: Optional[str] = Field(None, example="Juan Pérez")
    role: Optional[UserRole] = Field(UserRole.STUDENT, example="STUDENT")


class UserResponse(UserBase):
    """Modelo para la respuesta de usuario."""

    id: str = Field(..., example="123e4567-e89b-12d3-a456-426614174000")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    """Modelo para la solicitud de inicio de sesión."""

    email: EmailStr = Field(..., example="usuario@example.com")
    password: str = Field(..., example="password123")


@router.post(
    "/login",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Iniciar sesión",
    description="""
    Autentica a un usuario en el sistema y devuelve tokens de acceso y actualización.
    
    Este endpoint valida las credenciales del usuario y, si son correctas,
    devuelve un token de acceso JWT y un token de actualización.
    """,
    responses={
        status.HTTP_200_OK: {
            "description": "Autenticación exitosa",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "refresh_token": "mock-refresh-token-12345",
                        "token_type": "bearer",
                        "expires_in": 3600,
                        "user": {
                            "id": "123e4567-e89b-12d3-a456-426614174000",
                            "username": "usuario123",
                            "email": "usuario@example.com",
                            "name": "Juan Pérez",
                            "role": "STUDENT",
                        },
                    }
                }
            },
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Datos de entrada inválidos o faltantes"
        },
        status.HTTP_401_UNAUTHORIZED: {"description": "Credenciales inválidas"},
    },
)
async def login(credentials: LoginRequest):
    """
    Autentica a un usuario y devuelve tokens de acceso.

    Args:
        credentials (LoginRequest): Credenciales de inicio de sesión (email y contraseña).

    Returns:
        dict: Diccionario con los tokens de acceso y la información del usuario.

    Raises:
        HTTPException:
            - 400: Si faltan credenciales o son inválidas.
            - 401: Si las credenciales son incorrectas.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{AUTH_SERVICE_URL}/auth/login",
                json={"username": credentials.email, "password": credentials.password},
            )

            if response.status_code != 200:
                error_detail = "Credenciales inválidas"
                try:
                    error_data = response.json()
                    if "detail" in error_data:
                        error_detail = error_data["detail"]
                except Exception:
                    pass
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, detail=error_detail
                )

            return response.json()
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Error al conectar con el servicio de autenticación",
        )


@router.post(
    "/register",
    response_model=Dict[str, Any],
    status_code=status.HTTP_201_CREATED,
    summary="Registrar nuevo usuario",
    description="""
    Crea una nueva cuenta de usuario en el sistema.
    
    Este endpoint permite a los nuevos usuarios registrarse en la plataforma
    proporcionando la información básica requerida.
    """,
    responses={
        status.HTTP_201_CREATED: {
            "description": "Usuario registrado exitosamente",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "refresh_token": "mock-refresh-token-12345",
                        "token_type": "bearer",
                        "expires_in": 3600,
                        "user": {
                            "id": "123e4567-e89b-12d3-a456-426614174000",
                            "username": "nuevousuario",
                            "email": "nuevo@example.com",
                            "name": "Nuevo Usuario",
                            "role": "STUDENT",
                        },
                    }
                }
            },
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Datos de entrada inválidos o usuario ya existe"
        },
        status.HTTP_422_UNPROCESSABLE_ENTITY: {
            "description": "Error de validación en los datos de entrada"
        },
    },
)
async def register(user_data: UserCreate):
    """
    Registra un nuevo usuario en el sistema.

    Args:
        user_data (UserCreate): Datos del nuevo usuario a registrar.

    Returns:
        dict: Información del usuario creado junto con los tokens de autenticación.

    Raises:
        HTTPException:
            - 400: Si el usuario ya existe o faltan campos requeridos.
            - 422: Si los datos de entrada no pasan la validación.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{AUTH_SERVICE_URL}/auth/register", json=user_data.dict()
            )

            if response.status_code != 201:
                error_detail = "Error al registrar usuario"
                try:
                    error_data = response.json()
                    if "detail" in error_data:
                        error_detail = error_data["detail"]
                except Exception:
                    pass
                raise HTTPException(
                    status_code=response.status_code, detail=error_detail
                )

            return response.json()
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Error al conectar con el servicio de autenticación",
        )


class RefreshTokenRequest(BaseModel):
    """Modelo para la solicitud de renovación de token."""

    refresh_token: str = Field(..., example="refresh-token-12345")


@router.post(
    "/refresh",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Renovar token de acceso",
    description="""
    Renueva un token de acceso vencido usando un refresh token válido.
    
    Este endpoint permite obtener un nuevo par de tokens (acceso y actualización)
    cuando el token de acceso ha expirado, sin necesidad de volver a autenticarse.
    """,
    responses={
        status.HTTP_200_OK: {
            "description": "Tokens renovados exitosamente",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        "refresh_token": "nuevo-mock-refresh-token-12345",
                        "token_type": "bearer",
                        "expires_in": 3600,
                        "user": {
                            "id": "123e4567-e89b-12d3-a456-426614174000",
                            "username": "usuario123",
                            "email": "usuario@example.com",
                        },
                    }
                }
            },
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Token de actualización inválido o mal formado"
        },
        status.HTTP_404_NOT_FOUND: {"description": "Usuario no encontrado"},
    },
)
async def refresh_token(token_data: RefreshTokenRequest):
    """
    Renueva el token de acceso usando un refresh token.

    Args:
        token_data (RefreshTokenRequest): Objeto con el refresh token.

    Returns:
        dict: Nuevo par de tokens y datos del usuario.

    Raises:
        HTTPException:
            - 400: Si el token es inválido o tiene un formato incorrecto.
            - 404: Si el usuario asociado al token no existe.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{AUTH_SERVICE_URL}/auth/refresh",
                json={"refresh_token": token_data.refresh_token},
            )

            if response.status_code != 200:
                error_detail = "Token de actualización inválido"
                try:
                    error_data = response.json()
                    if "detail" in error_data:
                        error_detail = error_data["detail"]
                except Exception:
                    pass
                raise HTTPException(
                    status_code=response.status_code, detail=error_detail
                )

            return response.json()
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Error al conectar con el servicio de autenticación",
        )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Cerrar sesión",
    description="""
    Cierra la sesión del usuario actual.
    
    En una implementación real, este endpoint invalidaría el token de acceso
    y el token de actualización del usuario.
    """,
    responses={
        status.HTTP_200_OK: {
            "description": "Sesión cerrada exitosamente",
            "content": {
                "application/json": {
                    "example": {
                        "success": True,
                        "message": "Sesión cerrada exitosamente",
                    }
                }
            },
        }
    },
)
async def logout(authorization: Optional[str] = Header(None)):
    """
    Cierra la sesión del usuario actual.

    Args:
        authorization (str, optional): Token de autenticación del usuario.

    Returns:
        dict: Confirmación de cierre de sesión.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se proporcionó token de autenticación",
        )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{AUTH_SERVICE_URL}/auth/logout",
                headers={"Authorization": authorization},
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code, detail="Error al cerrar sesión"
                )

            return response.json()
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Error al conectar con el servicio de autenticación",
        )


@router.get(
    "/me",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Obtener información del usuario actual",
    description="""
    Devuelve la información del usuario autenticado.
    
    Este endpoint requiere autenticación mediante un token JWT válido
    en el encabezado de autorización.
    """,
    responses={
        status.HTTP_200_OK: {
            "description": "Información del usuario autenticado",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "username": "usuario123",
                        "email": "usuario@example.com",
                        "name": "Juan Pérez",
                        "role": "STUDENT",
                        "created_at": "2023-01-01T00:00:00",
                        "updated_at": "2023-01-01T00:00:00",
                    }
                }
            },
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "No autenticado o token inválido"
        },
    },
)
async def get_current_user(
    authorization: Optional[str] = Header(None, alias="Authorization")
):
    """
    Obtiene la información del usuario autenticado.

    Args:
        authorization (str, optional): Token de autenticación en formato 'Bearer token'.

    Returns:
        dict: Información del usuario autenticado.

    Raises:
        HTTPException:
            - 401: Si no se proporciona token o es inválido.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se proporcionó token de autenticación",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{AUTH_SERVICE_URL}/auth/me", headers={"Authorization": authorization}
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Error al obtener información del usuario",
                )

            return response.json()
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Error al conectar con el servicio de autenticación",
        )

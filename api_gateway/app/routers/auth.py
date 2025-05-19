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

# Importar funciones de base de datos simulada
from app.utils.mock_db import (
    get_user_by_email,
    get_user_by_id,
    generate_mock_token,
    add_user,
    verify_mock_token,
    get_user_by_username,
)

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


class UserCreate(UserBase):
    """Modelo para la creación de usuarios."""

    password: str = Field(..., min_length=8, example="contraseñaSegura123")


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
    password: str = Field(..., example="contraseñaSegura123")


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
    Autentica a un usuario y devuelve tokens de acceso y actualización.

    Args:
        credentials (LoginRequest): Credenciales de inicio de sesión (email y contraseña).

    Returns:
        dict: Diccionario con los tokens de acceso y la información del usuario.

    Raises:
        HTTPException:
            - 400: Si faltan credenciales o son inválidas.
            - 401: Si las credenciales son incorrectas.
    """
    # Validar que se proporcionaron ambos campos
    if not credentials.email or not credentials.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Se requieren email y contraseña",
        )

    # NOTA: En producción, la contraseña debería estar hasheada usando bcrypt o similar
    # y comparada con un hash almacenado en la base de datos
    user = get_user_by_email(credentials.email)
    if (
        not user or credentials.password != "password123"
    ):  # Contraseña hardcodeada solo para desarrollo
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
        )

    # Generar tokens
    token_data = generate_mock_token(user["id"])

    return {"user": user, **token_data}


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
    # Verificar si el usuario ya existe
    if get_user_by_email(user_data.email) or get_user_by_username(user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico o nombre de usuario ya está en uso",
        )

    # Crear usuario
    new_user = add_user(
        username=user_data.username,
        email=user_data.email,
        password=user_data.password,  # En producción, esto debería estar hasheado
        name=user_data.name,
        role=user_data.role.value if user_data.role else UserRole.STUDENT.value,
    )

    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo crear el usuario",
        )

    # Generar tokens
    token_data = generate_mock_token(new_user["id"])

    return {"user": new_user, **token_data}


class RefreshTokenRequest(BaseModel):
    """Modelo para la solicitud de renovación de token."""

    refresh_token: str = Field(..., example="mock-refresh-token-12345")


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
    refresh_token = token_data.refresh_token

    if not refresh_token or not refresh_token.startswith("mock-refresh-token-"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de actualización inválido",
        )

    # Extraer ID de usuario del token
    parts = refresh_token.split("-")
    if len(parts) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de token de actualización inválido",
        )

    user_id = parts[3]
    user = get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado"
        )

    # Generar nuevos tokens
    token_data = generate_mock_token(user["id"])

    return {"user": user, **token_data}


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
    # En una implementación real, aquí se invalidarían los tokens
    # token = authorization.split(" ")[1] if authorization else None
    # invalidate_token(token)

    return {"success": True, "message": "Sesión cerrada exitosamente"}


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
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Esquema de autenticación inválido")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Formato de autorización inválido. Se espera 'Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verificar token
    user = verify_mock_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

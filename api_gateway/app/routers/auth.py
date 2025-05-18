"""
Módulo de autenticación para CourseClash API Gateway

Este módulo proporciona endpoints para:
- Inicio de sesión de usuarios
- Registro de nuevos usuarios
- Renovación de tokens de acceso
- Cierre de sesión
- Validación de tokens

Utiliza una base de datos simulada para desarrollo, pero está diseñado para integrarse
con un servicio de autenticación externo en producción.
"""

from fastapi import APIRouter, HTTPException, Depends, Header, Request, status
from typing import Optional, Dict
import os

# Importar funciones de base de datos simulada
from app.utils.mock_db import (
    get_user_by_email, 
    get_user_by_id, 
    generate_mock_token, 
    add_user, 
    verify_mock_token,
    get_user_by_username
)

router = APIRouter()

# Endpoints de autenticación simulada
@router.post("/login")
async def login(request: Request):
    """
    Autentica a un usuario y devuelve tokens de acceso y actualización.
    
    Args:
        request: Objeto de solicitud que debe contener email y contraseña
        
    Returns:
        dict: Tokens de acceso y actualización junto con información del usuario
        
    Raises:
        HTTPException: Si faltan credenciales o son inválidas
    """
    body = await request.json()
    email = body.get("email")
    password = body.get("password")
    
    # Validar que se proporcionaron ambos campos
    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Se requieren email y contraseña"
        )
    
    # NOTA: En producción, la contraseña debería estar hasheada usando bcrypt o similar
    # y comparada con un hash almacenado en la base de datos
    user = get_user_by_email(email)
    if not user or password != "password123":  # Contraseña hardcodeada solo para desarrollo
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Generate token
    token_data = generate_mock_token(user["id"])
    
    return {
        "user": user,
        **token_data
    }

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(request: Request):
    body = await request.json()
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")
    name = body.get("name")
    role = body.get("role", "STUDENT")
    
    if not username or not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username, email, and password are required"
        )
    
    # Create user
    new_user = add_user(username, email, password, name, role)
    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    # Generate token
    token_data = generate_mock_token(new_user["id"])
    
    return {
        "user": new_user,
        **token_data
    }

@router.post("/refresh")
async def refresh_token(request: Request):
    body = await request.json()
    refresh_token = body.get("refreshToken")
    
    if not refresh_token or not refresh_token.startswith("mock-refresh-token-"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid refresh token"
        )
    
    # Extract user ID from token
    parts = refresh_token.split("-")
    if len(parts) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid refresh token format"
        )
    
    user_id = parts[3]
    user = get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Generate new token
    token_data = generate_mock_token(user["id"])
    
    return {
        "user": user,
        **token_data
    }

@router.post("/logout")
async def logout():
    # In a real implementation, this would invalidate the token
    return {"success": True}

@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Extract token from authorization header
    scheme, token = authorization.split()
    if scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme"
        )
    
    # Verify token
    user = verify_mock_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or token expired"
        )
    
    return user
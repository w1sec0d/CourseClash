from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Dict, Any

from ..core.config import settings
from ..core.security import get_token_from_auth0, get_user_info_from_auth0
from ..db import get_db, sync_auth0_user
from ..models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Endpoint para obtener un token de acceso usando Auth0"""
    try:
        # Obtener token de Auth0
        auth0_response = get_token_from_auth0(form_data.username, form_data.password)
        
        # Obtener información del usuario desde Auth0
        access_token = auth0_response.get("access_token")
        user_info = get_user_info_from_auth0(access_token)
        
        # Sincronizar usuario con la base de datos
        user = sync_auth0_user(db, user_info)
        
        # Devolver la respuesta de Auth0 con información adicional
        return {
            **auth0_response,
            "user_id": user.id,
            "email": user.email,
            "name": user.name
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"No se pudo autenticar: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

@router.get("/me", response_model=Dict[str, Any])
async def get_current_user_info(
    request: Request,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Endpoint para obtener información del usuario actual"""
    # Obtener el token de autorización del encabezado
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autorización no proporcionado",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = auth_header.split(" ")[1]
    
    try:
        # Obtener información del usuario desde Auth0
        user_info = get_user_info_from_auth0(token)
        
        # Sincronizar usuario con la base de datos
        user = sync_auth0_user(db, user_info)
        
        # Devolver información del usuario
        return {
            "id": user.id,
            "auth0_id": user.auth0_id,
            "email": user.email,
            "name": user.name,
            "nickname": user.nickname,
            "picture": user.picture,
            "rank": user.rank,
            "points": user.points,
            "level": user.level
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"No se pudo obtener información del usuario: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

@router.get("/callback")
async def auth0_callback(code: str, state: str = None):
    """Endpoint para manejar el callback de Auth0 (usado en flujo de autorización)"""
    # Este endpoint es necesario para el flujo de autorización de Auth0
    # Normalmente redirige al frontend con el código de autorización
    return {"code": code, "state": state}

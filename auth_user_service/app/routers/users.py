from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from ..core.dependencies import require_auth, require_permissions, is_admin
from ..db import get_db
from ..models.user import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[Dict[str, Any]])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(is_admin)  # Solo administradores pueden ver todos los usuarios
):
    """Obtener lista de usuarios (solo administradores)"""
    users = db.query(User).offset(skip).limit(limit).all()
    return [{
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "nickname": user.nickname,
        "is_active": user.is_active,
        "rank": user.rank,
        "level": user.level,
        "points": user.points
    } for user in users]

@router.get("/{user_id}", response_model=Dict[str, Any])
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_auth)  # Cualquier usuario autenticado puede ver un perfil
):
    """Obtener un usuario por ID"""
    # Verificar si el usuario solicitado es el usuario actual o si es administrador
    is_self = current_user.get("id") == user_id
    is_admin_user = "admin:all" in current_user.get("permissions", [])
    
    if not (is_self or is_admin_user):
        # Para usuarios no administradores, solo permitir ver información básica
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        return {
            "id": user.id,
            "nickname": user.nickname,
            "rank": user.rank,
            "level": user.level,
            "points": user.points
        }
    
    # Para administradores o el propio usuario, permitir ver toda la información
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return {
        "id": user.id,
        "auth0_id": user.auth0_id,
        "email": user.email,
        "name": user.name,
        "nickname": user.nickname,
        "picture": user.picture,
        "is_active": user.is_active,
        "rank": user.rank,
        "level": user.level,
        "points": user.points,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "last_login": user.last_login
    }

@router.patch("/{user_id}", response_model=Dict[str, Any])
async def update_user(
    user_id: int,
    user_data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(require_auth)
):
    """Actualizar datos de un usuario"""
    # Verificar si el usuario a actualizar es el usuario actual o si es administrador
    is_self = current_user.get("id") == user_id
    is_admin_user = "admin:all" in current_user.get("permissions", [])
    
    if not (is_self or is_admin_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para actualizar este usuario"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Campos que un usuario normal puede actualizar
    allowed_fields = ["nickname"]
    
    # Campos adicionales que un administrador puede actualizar
    admin_fields = ["is_active", "rank", "level", "points"]
    
    # Actualizar campos permitidos
    for field in allowed_fields:
        if field in user_data:
            setattr(user, field, user_data[field])
    
    # Si es administrador, actualizar campos adicionales
    if is_admin_user:
        for field in admin_fields:
            if field in user_data:
                setattr(user, field, user_data[field])
    
    db.commit()
    db.refresh(user)
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "nickname": user.nickname,
        "is_active": user.is_active,
        "rank": user.rank,
        "level": user.level,
        "points": user.points,
        "updated_at": user.updated_at
    }

@router.get("/search/by-email/{email}", response_model=Dict[str, Any])
async def get_user_by_email(
    email: str,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(is_admin)  # Solo administradores pueden buscar por email
):
    """Buscar usuario por email (solo administradores)"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return {
        "id": user.id,
        "auth0_id": user.auth0_id,
        "email": user.email,
        "name": user.name,
        "nickname": user.nickname,
        "is_active": user.is_active,
        "rank": user.rank,
        "level": user.level,
        "points": user.points
    }

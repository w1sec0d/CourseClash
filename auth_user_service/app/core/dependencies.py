from fastapi import Depends, HTTPException, status
from typing import Dict, Any, Optional, List

from .security import get_current_user
from .config import settings

def require_auth(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Dependencia básica que requiere autenticación"""
    return current_user

def require_permissions(required_permissions: List[str]):
    """Dependencia que verifica que el usuario tenga los permisos necesarios"""
    def _require_permissions(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_permissions = current_user.get("permissions", [])
        
        for permission in required_permissions:
            if permission not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permiso insuficiente: {permission} es requerido"
                )
        
        return current_user
    
    return _require_permissions

def is_admin(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Dependencia que verifica si el usuario es administrador"""
    user_permissions = current_user.get("permissions", [])
    
    if "admin:all" not in user_permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador"
        )
    
    return current_user

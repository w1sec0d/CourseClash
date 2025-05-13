import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
import requests

from .config import settings

# Configuración del token bearer para autenticación
security = HTTPBearer()

# Cliente para obtener las claves públicas de Auth0
jwks_client = PyJWKClient(f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json")

def verify_token(token: str) -> Dict[str, Any]:
    """Verifica un token JWT de Auth0"""
    try:
        # Obtener la clave de firma adecuada
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # Decodificar y verificar el token
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=[settings.AUTH0_ALGORITHMS],
            audience=settings.AUTH0_API_AUDIENCE,
            issuer=f"https://{settings.AUTH0_DOMAIN}/"
        )
        
        return payload
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependencia para obtener el usuario actual basado en el token JWT"""
    token = credentials.credentials
    payload = verify_token(token)
    
    # Extraer información relevante del payload
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se pudo validar las credenciales"
        )
    
    # Aquí puedes agregar lógica para buscar o crear el usuario en tu base de datos
    # basado en el user_id de Auth0
    
    return {
        "auth0_id": user_id,
        "email": payload.get("email"),
        "permissions": payload.get("permissions", []),
    }

def get_token_from_auth0(username: str, password: str) -> Dict[str, Any]:
    """Obtiene un token de Auth0 usando Resource Owner Password Grant"""
    payload = {
        "grant_type": "password",
        "username": username,
        "password": password,
        "client_id": settings.AUTH0_CLIENT_ID,
        "client_secret": settings.AUTH0_CLIENT_SECRET,
        "audience": settings.AUTH0_API_AUDIENCE,
        "scope": "openid profile email"
    }
    
    response = requests.post(
        f"https://{settings.AUTH0_DOMAIN}/oauth/token",
        json=payload
    )
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )
    
    return response.json()

def get_user_info_from_auth0(token: str) -> Dict[str, Any]:
    """Obtiene información del usuario desde Auth0 usando el token de acceso"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"https://{settings.AUTH0_DOMAIN}/userinfo",
        headers=headers
    )
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se pudo obtener información del usuario"
        )
    
    return response.json()

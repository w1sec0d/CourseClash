from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import jwt
import os
import logging

logger = logging.getLogger(__name__)

class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware para validar tokens JWT en las peticiones
    """
    
    def __init__(self, app):
        super().__init__(app)
        self.jwt_secret = os.getenv("JWT_SECRET", "your_jwt_secret_key12")
        self.algorithm = "HS256"
        
        # Rutas que no requieren autenticación
        self.public_paths = {
            "/",
            "/health",
            "/docs",
            "/redoc",
            "/openapi.json"
        }
    
    async def dispatch(self, request: Request, call_next):
        """
        Procesa la petición y valida el token JWT si es necesario
        """
        # Permitir rutas públicas
        if request.url.path in self.public_paths:
            return await call_next(request)
            
        # Permitir peticiones OPTIONS (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)
        
        try:
            # Extraer token del header Authorization
            authorization = request.headers.get("Authorization")
            if not authorization:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Token de autorización requerido"}
                )
            
            # Validar formato del token
            if not authorization.startswith("Bearer "):
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Formato de token inválido"}
                )
            
            token = authorization.split(" ")[1]
            
            # Decodificar y validar token
            try:
                payload = jwt.decode(token, self.jwt_secret, algorithms=[self.algorithm])
                
                # Agregar información del usuario a la petición
                request.state.user_id = payload.get("sub")
                request.state.user_role = payload.get("role", "student")
                request.state.user_email = payload.get("email")
                
                # Verificar que el token contenga información básica
                if not request.state.user_id:
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={"detail": "Token inválido: falta información del usuario"}
                    )
                
            except jwt.ExpiredSignatureError:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Token expirado"}
                )
            except jwt.InvalidTokenError:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Token inválido"}
                )
            
            # Continuar con la petición
            response = await call_next(request)
            return response
            
        except Exception as e:
            logger.error(f"Error en el middleware de autenticación: {e}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"detail": "Error interno del servidor"}
            )

def get_current_user(request: Request):
    """
    Obtiene la información del usuario actual desde el estado de la petición
    """
    return {
        "user_id": getattr(request.state, "user_id", None),
        "role": getattr(request.state, "user_role", "student"),
        "email": getattr(request.state, "user_email", None)
    }

def require_teacher_or_admin(request: Request):
    """
    Verifica que el usuario tenga rol de profesor o administrador
    """
    user_role = getattr(request.state, "user_role", "student")
    if user_role not in ["teacher", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado: se requiere rol de profesor o administrador"
        ) 
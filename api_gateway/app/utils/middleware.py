"""
Middleware de autenticación para CourseClash API Gateway

Este módulo proporciona middlewares para:
- Verificar tokens de autenticación JWT
- Gestionar el acceso a rutas protegidas
- Adjuntar información de usuario autenticado a las solicitudes

Funcionalidades principales:
- Verificación de tokens en cabeceras de autorización
- Manejo de rutas públicas (sin autenticación)
- Validación del esquema de autenticación Bearer
- Inyección del usuario autenticado en el estado de la solicitud
"""

from fastapi import Request, HTTPException, status
from app.utils.mock_db import verify_mock_token

async def verify_auth_token(request: Request):
    """
    Middleware que verifica el token JWT en las cabeceras de la solicitud.
    
    Este middleware se encarga de:
    1. Verificar si la ruta es pública y puede ser accedida sin autenticación
    2. Validar el formato del token de autenticación
    3. Verificar la validez del token
    4. Adjuntar la información del usuario autenticado a la solicitud
    
    Args:
        request: Objeto Request de FastAPI
        
    Raises:
        HTTPException: 401 si la autenticación falla o el token es inválido
    """
    # Rutas públicas que no requieren autenticación
    public_paths = ("/docs", "/openapi.json", "/redoc", "/health", "/graphql")
    if request.url.path.startswith(public_paths):
        return
        
    # Las solicitudes OPTIONS (pre-vuelo CORS) no requieren autenticación
    if request.method == "OPTIONS":
        return
        
    # Obtener la cabecera de autorización
    auth_header = request.headers.get("authorization")
    
    # Verificar que la cabecera de autorización existe
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se proporcionó token de autenticación"
        )
        
    try:
        # El formato esperado es: "Bearer <token>"
        parts = auth_header.split()
        if len(parts) != 2:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Formato de autorización inválido. Se espera: 'Bearer <token>'"
            )
            
        scheme, token = parts
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Esquema de autenticación no soportado. Use 'Bearer'"
            )
            
        # Verificar la validez del token
        user = verify_mock_token(token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido o expirado"
            )
            
        # Adjuntar el usuario autenticado al estado de la solicitud
        # para que esté disponible en los manejadores de ruta
        request.state.user = user
    except HTTPException:
        # Re-lanzar las excepciones HTTP que ya tienen un formato adecuado
        raise
    except Exception as e:
        # Capturar cualquier otro error inesperado durante la autenticación
        # NOTA: En producción, registrar este error en un sistema de monitoreo
        # logger.error(f"Error en la autenticación: {str(e)}", exc_info=True)
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Error en la autenticación: {str(e)}"
        )

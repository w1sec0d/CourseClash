"""
Middlewares personalizados para el API Gateway de CourseClash.

Incluye:
- Logging de peticiones HTTP
- Manejo de tiempo de respuesta
- Filtrado de rutas sensibles
"""

import time
from typing import Callable, Awaitable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.types import ASGIApp

from app.core.logger import logger

class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware para registrar información detallada de cada petición HTTP."""
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Ignorar rutas de salud y documentación
        if request.url.path in ["/health", "/docs", "/openapi.json", "/redoc"]:
            return await call_next(request)
        
        # Registrar inicio de la petición
        start_time = time.time()
        
        # Procesar la petición
        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000  # en milisegundos
            
            # Registrar información de la petición
            extra = {
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "process_time_ms": round(process_time, 2),
                "query_params": dict(request.query_params) if request.query_params else None,
                "client": request.client.host if request.client else None,
            }
            
            # Clasificar el nivel de log basado en el código de estado
            if 500 <= response.status_code < 600:
                logger.error("Error en la petición", extra=extra)
            elif 400 <= response.status_code < 500:
                logger.warning("Petición con error del cliente", extra=extra)
            else:
                logger.info("Petición completada", extra=extra)
                
            return response
            
        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            logger.exception(
                f"Error al procesar la petición: {str(e)}",
                extra={
                    "method": request.method,
                    "path": request.url.path,
                    "process_time_ms": round(process_time, 2),
                    "error": str(e),
                    "error_type": type(e).__name__,
                }
            )
            raise

def setup_middlewares(app: ASGIApp) -> None:
    """Configura los middlewares de la aplicación."""
    app.add_middleware(LoggingMiddleware)

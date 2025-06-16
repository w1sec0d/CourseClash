"""
Middlewares personalizados para el API Gateway de CourseClash.

Incluye:
- Logging de peticiones HTTP
- Manejo de tiempo de respuesta
- Filtrado de rutas sensibles
- Logging de cuerpos de request y response para depuración
- Manejo de cookies de autenticación
"""

import time
import json
from typing import Callable, Awaitable, List, Set, Dict, Any
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.types import ASGIApp
import os

from app.core.logger import logger


class ExtendedLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware para registrar información detallada de cada petición HTTP, incluyendo cuerpos de request y response."""

    # Rutas a ignorar para el logging extensivo
    IGNORED_PATHS: Set[str] = {
        "/health",
        "/docs",
        "/openapi.json",
        "/redoc",
        "/favicon.ico",
    }

    # Headers sensibles que no se deben registrar
    SENSITIVE_HEADERS: Set[str] = {"authorization", "cookie", "set-cookie", "x-api-key"}

    # Campos sensibles que se deben redactar del body
    SENSITIVE_FIELDS: Set[str] = {
        "password",
        "token",
        "secret",
        "api_key",
        "apikey",
        "key",
        "authorization",
    }

    def __init__(self, app: ASGIApp, max_body_size: int = 10000):
        super().__init__(app)
        self.max_body_size = (
            max_body_size  # Tamaño máximo del cuerpo para registrar (en bytes)
        )

    def _redact_sensitive_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Redacta información sensible del diccionario de datos."""
        if not isinstance(data, dict):
            return data

        redacted_data = {}
        for key, value in data.items():
            if isinstance(key, str) and any(
                sensitive in key.lower() for sensitive in self.SENSITIVE_FIELDS
            ):
                redacted_data[key] = "[REDACTED]"
            elif isinstance(value, dict):
                redacted_data[key] = self._redact_sensitive_data(value)
            elif isinstance(value, list):
                redacted_data[key] = [
                    (
                        self._redact_sensitive_data(item)
                        if isinstance(item, dict)
                        else item
                    )
                    for item in value
                ]
            else:
                redacted_data[key] = value
        return redacted_data

    async def _get_request_body(self, request: Request) -> dict:
        """Obtiene y procesa el cuerpo de la petición."""
        # Verificar si el tipo de contenido es JSON
        is_json = (
            request.headers.get("content-type", "")
            .lower()
            .startswith("application/json")
        )

        try:
            body = await request.body()
            body_size = len(body)

            # Decidir si registrar el cuerpo completo o truncado
            if body_size > self.max_body_size:
                body_text = f"[BODY TRUNCATED - {body_size} bytes]"
            elif body_size == 0:
                body_text = "[EMPTY BODY]"
            else:
                body_text = body.decode("utf-8", errors="replace")

                # Intentar parsear JSON y redactar campos sensibles
                if is_json and body_text:
                    try:
                        body_json = json.loads(body_text)
                        body_json = self._redact_sensitive_data(body_json)
                        body_text = json.dumps(body_json)
                    except json.JSONDecodeError:
                        pass  # Si no es JSON válido, mantener como texto

            return {
                "body": body_text,
                "size_bytes": body_size,
                "content_type": request.headers.get("content-type", "unknown"),
            }
        except Exception as e:
            return {"body_error": f"Error al leer el cuerpo: {str(e)}"}

    def _get_headers(self, headers: Dict[str, str]) -> Dict[str, str]:
        """Procesa los headers, redactando información sensible."""
        processed_headers = {}
        for name, value in headers.items():
            if name.lower() in self.SENSITIVE_HEADERS:
                processed_headers[name] = "[REDACTED]"
            else:
                processed_headers[name] = value
        return processed_headers

    async def _get_response_body(self, response: Response) -> dict:
        """Obtiene y procesa el cuerpo de la respuesta."""
        # Verificar si el tipo de contenido es JSON
        is_json = (
            response.headers.get("content-type", "")
            .lower()
            .startswith("application/json")
        )

        body = getattr(response, "body", b"")
        body_size = len(body) if body else 0

        if body_size > self.max_body_size:
            body_text = f"[BODY TRUNCATED - {body_size} bytes]"
        elif body_size == 0:
            body_text = "[EMPTY BODY]"
        else:
            body_text = body.decode("utf-8", errors="replace") if body else ""

            # Intentar parsear JSON y redactar campos sensibles
            if is_json and body_text:
                try:
                    body_json = json.loads(body_text)
                    body_json = self._redact_sensitive_data(body_json)
                    body_text = json.dumps(body_json)
                except json.JSONDecodeError:
                    pass  # Si no es JSON válido, mantener como texto

        return {
            "body": body_text,
            "size_bytes": body_size,
            "content_type": response.headers.get("content-type", "unknown"),
        }

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Ignorar rutas de salud y documentación para el logging detallado
        if request.url.path in self.IGNORED_PATHS:
            return await call_next(request)

        # Registrar inicio de la petición
        start_time = time.time()
        request_id = f"{int(start_time * 1000)}-{hash(request.url.path) % 10000}"

        # Obtener y registrar información de la petición entrante
        # NOTA: Temporalmente deshabilitado para evitar consumir el cuerpo de la petición
        # que causa problemas con Strawberry GraphQL
        request_body = {"body": "[DISABLED FOR GRAPHQL]", "content_type": "none"}
        request_headers = self._get_headers(dict(request.headers))

        # Log de la petición
        request_info = {
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "query_params": (
                dict(request.query_params) if request.query_params else None
            ),
            "headers": request_headers,
            "body": request_body,
            "client": request.client.host if request.client else None,
        }

        logger.info(
            f"Petición recibida: {request.method} {request.url.path}",
            extra={"request": request_info},
        )

        # Procesar la petición
        try:
            # Llamar al siguiente middleware/endpoint
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000  # en milisegundos

            # Obtener y registrar información de la respuesta
            response_body = (
                await self._get_response_body(response)
                if "application/json"
                in response.headers.get("content-type", "").lower()
                else {
                    "body": "[NOT JSON]",
                    "content_type": response.headers.get("content-type", "unknown"),
                }
            )
            response_headers = self._get_headers(dict(response.headers))

            # Crear información completa de la operación
            response_info = {
                "request_id": request_id,
                "status_code": response.status_code,
                "headers": response_headers,
                "body": response_body,
                "process_time_ms": round(process_time, 2),
            }

            # Log diferente según el código de estado
            if 500 <= response.status_code < 600:
                logger.error(
                    f"Error en la petición {request_id}",
                    extra={"response": response_info},
                )
            elif 400 <= response.status_code < 500:
                logger.warning(
                    f"Petición con error del cliente {request_id}",
                    extra={"response": response_info},
                )
            else:
                logger.info(
                    f"Petición completada {request_id}",
                    extra={"response": response_info},
                )

            return response

        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            error_info = {
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "process_time_ms": round(process_time, 2),
                "error": str(e),
                "error_type": type(e).__name__,
            }

            logger.exception(
                f"Error al procesar la petición {request_id}",
                extra={"error": error_info},
            )
            raise


class AuthCookieMiddleware(BaseHTTPMiddleware):
    """Middleware para manejar cookies de autenticación."""

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        response = await call_next(request)

        # Si la respuesta es un GraphQL response y contiene datos de autenticación exitosa
        if (
            hasattr(response, "body")
            and response.headers.get("content-type", "").startswith("application/json")
            and request.url.path.endswith("/graphql")
        ):
            try:
                # Solo procesar si no se ha establecido ya una cookie
                if "Set-Cookie" not in response.headers:
                    body = getattr(response, "body", b"")
                    if body:
                        response_data = json.loads(body.decode("utf-8"))

                        # Verificar si hay datos de login exitoso
                        if (
                            "data" in response_data
                            and response_data["data"]
                            and "login" in response_data["data"]
                        ):
                            login_data = response_data["data"]["login"]

                            # Si es un AuthSuccess, establecer cookies
                            if (
                                isinstance(login_data, dict)
                                and login_data.get("__typename") == "AuthSuccess"
                                and "token" in login_data
                            ):
                                # Establecer cookie para el token de acceso
                                cookie_settings = {
                                    "path": "/",
                                    "max_age": 30 * 24 * 60 * 60,  # 30 días
                                    "httponly": True,
                                    "samesite": "strict",
                                }

                                # Solo secure en producción
                                if os.getenv("NODE_ENV") == "production":
                                    cookie_settings["secure"] = True

                                # Establecer cookie de token de acceso
                                response.set_cookie(
                                    key="auth_token",
                                    value=login_data["token"],
                                    **cookie_settings,
                                )

                                # Establecer cookie de refresh token si existe
                                if (
                                    "refreshToken" in login_data
                                    and login_data["refreshToken"]
                                ):
                                    response.set_cookie(
                                        key="refresh_token",
                                        value=login_data["refreshToken"],
                                        **cookie_settings,
                                    )

                                logger.info("🍪 Cookies de autenticación establecidas")

                        # Verificar si hay datos de register exitoso
                        elif (
                            "data" in response_data
                            and response_data["data"]
                            and "register" in response_data["data"]
                        ):
                            register_data = response_data["data"]["register"]

                            # Si es un AuthSuccess, establecer cookies
                            if (
                                isinstance(register_data, dict)
                                and register_data.get("__typename") == "AuthSuccess"
                                and "token" in register_data
                            ):
                                # Establecer cookie para el token de acceso
                                cookie_settings = {
                                    "path": "/",
                                    "max_age": 30 * 24 * 60 * 60,  # 30 días
                                    "httponly": True,
                                    "samesite": "strict",
                                }

                                # Solo secure en producción
                                if os.getenv("NODE_ENV") == "production":
                                    cookie_settings["secure"] = True

                                # Establecer cookie de token de acceso
                                response.set_cookie(
                                    key="auth_token",
                                    value=register_data["token"],
                                    **cookie_settings,
                                )

                                # Establecer cookie de refresh token si existe
                                if (
                                    "refreshToken" in register_data
                                    and register_data["refreshToken"]
                                ):
                                    response.set_cookie(
                                        key="refresh_token",
                                        value=register_data["refreshToken"],
                                        **cookie_settings,
                                    )

                                logger.info("🍪 Cookies de registro establecidas")

                        # Verificar si es una operación de logout exitosa
                        elif (
                            "data" in response_data
                            and response_data["data"]
                            and "logout" in response_data["data"]
                            and response_data["data"]["logout"] is True
                        ):
                            # Limpiar cookies en logout
                            response.set_cookie(
                                key="auth_token",
                                value="",
                                path="/",
                                expires="Thu, 01 Jan 1970 00:00:00 GMT",
                                httponly=True,
                                samesite="strict",
                            )
                            response.set_cookie(
                                key="refresh_token",
                                value="",
                                path="/",
                                expires="Thu, 01 Jan 1970 00:00:00 GMT",
                                httponly=True,
                                samesite="strict",
                            )
                            logger.info(
                                "🧹 Cookies de autenticación limpiadas en logout"
                            )

            except (json.JSONDecodeError, KeyError, AttributeError) as e:
                # Si hay error parseando, no afectar la respuesta
                logger.debug(f"Error procesando respuesta para cookies: {e}")
                pass

        return response


def setup_middlewares(app: ASGIApp) -> None:
    """Configura los middlewares de la aplicación."""
    # Configurar el tamaño máximo del cuerpo a registrar (por defecto 10KB)
    max_body_size = int(os.getenv("LOG_MAX_BODY_SIZE", "10000"))
    app.add_middleware(ExtendedLoggingMiddleware, max_body_size=max_body_size)
    app.add_middleware(AuthCookieMiddleware)

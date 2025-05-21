"""
Módulo de Resolvers de Autenticación para GraphQL

Este módulo implementa las operaciones de autenticación y gestión de usuarios
del API Gateway de CourseClash utilizando GraphQL. Proporciona funcionalidades para:

- Inicio de sesión y registro de usuarios
- Gestión de tokens de autenticación
- Consulta de información de usuarios
- Operaciones de autenticación como cierre de sesión y restablecimiento de contraseña

El módulo está diseñado para trabajar con una base de datos simulada (mock) con fines
de desarrollo, pero está estructurado para facilitar la migración a una implementación
real con base de datos en producción.
"""

import strawberry
from typing import List, Optional
from datetime import datetime
import os
import httpx
from enum import Enum, auto

# Environment variables
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth_user_service:8000")


# Tipos GraphQL para el módulo de autenticación
@strawberry.enum
class UserRole(Enum):
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"
    ADMIN = "ADMIN"


@strawberry.type
class User:
    id: str
    username: str
    email: str
    fullName: Optional[str] = None
    avatar: Optional[str] = None
    role: UserRole
    createdAt: str
    updatedAt: Optional[str] = None


@strawberry.type
class AuthSuccess:
    user: User
    token: str
    refreshToken: str
    expiresAt: str


@strawberry.type
class AuthError:
    message: str
    code: str


# Unión de tipos para la respuesta de autenticación
AuthResult = strawberry.union("AuthResult", (AuthSuccess, AuthError))


@strawberry.type
class ForgotPasswordSuccess:
    message: str
    code: str
    token: str


@strawberry.type
class ForgotPasswordError:
    message: str
    code: str


# Unión de tipos para la respuesta de forgot password
ForgotPasswordResult = strawberry.union(
    "ForgotPasswordResult", (ForgotPasswordSuccess, ForgotPasswordError)
)


@strawberry.type
class UpdatePasswordSuccess:
    message: str


@strawberry.type
class UpdatePasswordError:
    message: str
    code: str


# Union type for update password response
UpdatePasswordResult = strawberry.union(
    "UpdatePasswordResult", (UpdatePasswordSuccess, UpdatePasswordError)
)


# Consultas (Queries)
@strawberry.type
class Query:
    @strawberry.field
    async def me(self, info) -> Optional[User]:
        """
        Obtiene la información del usuario autenticado actualmente.

        Returns:
            Optional[User]: Información del usuario o None si no está autenticado
        """
        request = info.context["request"]
        auth_header = request.headers.get("authorization")

        if not auth_header:
            return None

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{AUTH_SERVICE_URL}/auth/me",
                    headers={"Authorization": auth_header},
                )

                if response.status_code != 200:
                    return None

                user_data = response.json()
                return User(**user_data)
        except Exception:
            return None

    @strawberry.field
    async def getUserById(self, id: str) -> Optional[User]:
        """
        Obtiene un usuario por su ID.

        Args:
            id (str): ID único del usuario

        Returns:
            Optional[User]: Información del usuario o None si no se encuentra
        """
        user_data = get_user_by_id(id)

        if not user_data:
            return None

        return User(
            id=user_data["id"],
            username=user_data["username"],
            email=user_data["email"],
            fullName=user_data.get("fullName"),
            avatar=user_data.get("avatar"),
            role=user_data["role"],
            createdAt=user_data["createdAt"],
            updatedAt=user_data.get("updatedAt"),
        )


# Mutaciones (Mutations)
@strawberry.type
class Mutation:
    @strawberry.mutation
    async def login(self, email: str, password: str) -> AuthResult:
        """
        Inicia sesión de un usuario con email y contraseña.

        Args:
            email (str): Correo electrónico del usuario
            password (str): Contraseña del usuario

        Returns:
            Union[AuthSuccess, AuthError]:
                - AuthSuccess: Si el inicio de sesión es exitoso, contiene el token y la información del usuario
                - AuthError: Si hay un error en la autenticación, contiene el mensaje y código de error

        Códigos de error posibles:
            - INVALID_CREDENTIALS: Las credenciales proporcionadas son incorrectas
            - ACCOUNT_LOCKED: La cuenta está bloqueada temporalmente
            - SERVER_ERROR: Error del servidor al procesar la solicitud
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{AUTH_SERVICE_URL}/auth/login",
                    json={"username": email, "password": password},
                )

                if response.status_code != 200:
                    error_data = response.json()
                    error_detail = "Credenciales inválidas"
                    error_code = "AUTHENTICATION_ERROR"

                    if "detail" in error_data:
                        if isinstance(error_data["detail"], dict):
                            error_detail = error_data["detail"].get(
                                "message", error_detail
                            )
                            error_code = error_data["detail"].get("code", error_code)
                        else:
                            error_detail = error_data["detail"]

                    return AuthError(message=error_detail, code=error_code)

                auth_data = response.json()
                user_data = auth_data.get("user", {})

                return AuthSuccess(
                    user=User(**user_data),
                    token=auth_data.get("access_token", ""),
                    refreshToken=auth_data.get("refresh_token", ""),
                    expiresAt=auth_data.get("expires_at", ""),
                )
        except Exception as e:
            return AuthError(message=str(e), code="SERVICE_ERROR")

    @strawberry.mutation
    async def register(
        self,
        username: str,
        email: str,
        password: str,
        fullName: Optional[str] = None,
        role: Optional[UserRole] = None,
    ) -> AuthResult:
        """
        Registra un nuevo usuario en el sistema.

        Args:
            username (str): Nombre de usuario
            email (str): Correo electrónico
            password (str): Contraseña
            fullName (Optional[str]): Nombre completo del usuario
            role (Optional[UserRole]): Rol del usuario

        Returns:
            AuthResult: Resultado de la operación de registro
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{AUTH_SERVICE_URL}/auth/register",
                    json={
                        "username": username,
                        "email": email,
                        "password": password,
                        "full_name": fullName,
                        "role": role.value if role else "STUDENT",
                    },
                )

                if response.status_code != 201:
                    error_detail = "Error al registrar usuario"
                    try:
                        error_data = response.json()
                        if "detail" in error_data:
                            error_detail = error_data["detail"]
                    except Exception:
                        pass
                    return AuthError(message=error_detail, code="REGISTRATION_ERROR")

                auth_data = response.json()
                user_data = auth_data.get("user", {})

                if "full_name" in user_data:
                    user_data["fullName"] = user_data.pop("full_name")

                return AuthSuccess(
                    user=User(**user_data),
                    token=auth_data.get("access_token", ""),
                    refreshToken=auth_data.get("refresh_token", ""),
                    expiresAt=auth_data.get("expires_at", ""),
                )
        except Exception as e:
            return AuthError(message=str(e), code="SERVICE_ERROR")

    @strawberry.mutation
    async def refreshToken(self, refreshToken: str) -> AuthResult:
        """
        Renueva el token de autenticación usando un refresh token.

        Args:
            refreshToken (str): Token de refresco obtenido durante el login

        Returns:
            AuthSuccess: Nuevo token e información del usuario

        Raises:
            Exception: Si el refresh token es inválido o el usuario no existe
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{AUTH_SERVICE_URL}/auth/refresh",
                    json={"refresh_token": refreshToken},
                )

                if response.status_code != 200:
                    error_detail = "Token de actualización inválido"
                    try:
                        error_data = response.json()
                        if "detail" in error_data:
                            error_detail = error_data["detail"]
                    except Exception:
                        pass
                    return AuthError(message=error_detail, code="REFRESH_ERROR")

                auth_data = response.json()
                user_data = auth_data.get("user", {})

                return AuthSuccess(
                    user=User(**user_data),
                    token=auth_data.get("access_token", ""),
                    refreshToken=auth_data.get("refresh_token", ""),
                    expiresAt=auth_data.get("expires_at", ""),
                )
        except Exception as e:
            return AuthError(message=str(e), code="SERVICE_ERROR")

    @strawberry.mutation
    async def logout(self, info) -> bool:
        """
        Cierra la sesión del usuario actual.

        Nota: En una implementación real, esto invalidaría el token.

        Returns:
            bool: Siempre retorna True indicando éxito
        """
        request = info.context["request"]
        auth_header = request.headers.get("authorization")

        if not auth_header:
            return False

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{AUTH_SERVICE_URL}/auth/logout",
                    headers={"Authorization": auth_header},
                )

                return response.status_code == 200
        except Exception:
            return False

    @strawberry.mutation
    async def resetPassword(self, email: str) -> bool:
        """
        Inicia el proceso de restablecimiento de contraseña.

        Args:
            email (str): Correo electrónico del usuario

        Returns:
            bool: True si el usuario existe, False en caso contrario

        Nota: En una implementación real, se enviaría un correo con un enlace
        para restablecer la contraseña.
        """
        # En una implementación real, aquí se enviaría un correo con un enlace
        # En esta implementación simulada, solo verificamos si el usuario existe
        user = get_user_by_email(email)
        return user is not None

    @strawberry.mutation
    async def updatePassword(
        self,
        newPassword: str,
        code: str,
        email: str,
        info,
    ) -> UpdatePasswordResult:
        try:
            auth_service_url = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000")
            update_password_url = f"{auth_service_url}/auth/update-password"

            # Get the token from the Authorization header
            auth_header = info.context["request"].headers.get("authorization")
            if not auth_header:
                print("❌ No authorization header found")
                return UpdatePasswordError(
                    message="No authorization token provided", code="INVALID_TOKEN"
                )

            # Extract the token from the Bearer header
            try:
                scheme, token = auth_header.split()
                if scheme.lower() != "bearer":
                    print("❌ Invalid authorization scheme:", scheme)
                    return UpdatePasswordError(
                        message="Invalid authorization scheme", code="INVALID_TOKEN"
                    )
            except ValueError as e:
                print("❌ Error parsing authorization header:", str(e))
                return UpdatePasswordError(
                    message="Invalid authorization header format", code="INVALID_TOKEN"
                )

            print(
                "🔑 Request details:",
                {
                    "url": update_password_url,
                    "email": email,
                    "code": code,
                    "token_length": len(token),
                    "timestamp": datetime.now().isoformat(),
                },
            )

            async with httpx.AsyncClient(timeout=10.0) as client:
                try:
                    response = await client.post(
                        update_password_url,
                        json={
                            "email": email,
                            "code": code,
                            "password": newPassword,
                        },
                        headers={"Authorization": f"Bearer {token}"},
                    )

                    print(
                        "📥 Auth service response:",
                        {
                            "status_code": response.status_code,
                            "headers": dict(response.headers),
                            "timestamp": datetime.now().isoformat(),
                        },
                    )

                    if response.status_code != 200:
                        error_detail = "Error al procesar la solicitud"
                        error_code = "SERVER_ERROR"
                        try:
                            error_data = response.json()
                            print("❌ Error response data:", error_data)
                            if isinstance(error_data.get("detail"), dict):
                                error_detail = error_data["detail"].get(
                                    "message", error_detail
                                )
                                error_code = error_data["detail"].get(
                                    "code", error_code
                                )
                            elif isinstance(error_data.get("detail"), str):
                                error_detail = error_data["detail"]
                        except Exception as json_error:
                            print(f"❌ Error parsing response: {str(json_error)}")

                        return UpdatePasswordError(
                            message=error_detail, code=error_code
                        )

                    return UpdatePasswordSuccess(
                        message="Contraseña actualizada correctamente"
                    )

                except httpx.RequestError as e:
                    print(f"❌ Request error: {str(e)}")
                    return UpdatePasswordError(
                        message=f"Error connecting to auth service: {str(e)}",
                        code="SERVER_ERROR",
                    )

        except Exception as e:
            print(f"❌ Unexpected error in updatePassword: {str(e)}")
            return UpdatePasswordError(
                message="Error al procesar la solicitud de restablecimiento de contraseña",
                code="SERVER_ERROR",
            )

    @strawberry.mutation
    async def forgotPassword(self, email: str) -> ForgotPasswordResult:
        """
        Inicia el proceso de restablecimiento de contraseña.

        Args:
            email (str): Correo electrónico del usuario

        Returns:
            Union[ForgotPasswordSuccess, ForgotPasswordError]:
                - ForgotPasswordSuccess: Si el proceso se inició correctamente
                - ForgotPasswordError: Si hay un error en el proceso

        Nota: En una implementación real, se enviaría un correo con un enlace
        para restablecer la contraseña.
        """
        try:
            # Preparar los datos para el microservicio de autenticación
            auth_service_url = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000")
            recovery_url = f"{auth_service_url}/auth/recovery"
            print("Recovery URL: ", recovery_url)

            # Utilizar el cliente HTTP para realizar la petición al microservicio
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Realizar la petición al microservicio de autenticación
                response = await client.post(recovery_url, json={"email": email})
                print("Response: ", response)
                print("Response JSON: ", response.json())

                # Log para depuración
                print(
                    f"Recovery request to {recovery_url} - Status: {response.status_code}"
                )

                # Si hay un error HTTP, devolver un error
                if response.status_code != 200:
                    error_detail = "Error al procesar la solicitud"
                    error_code = "SERVER_ERROR"
                    try:
                        error_data = response.json()
                        if isinstance(error_data.get("detail"), dict):
                            error_detail = error_data["detail"].get(
                                "message", error_detail
                            )
                            error_code = error_data["detail"].get("code", error_code)
                        elif isinstance(error_data.get("detail"), str):
                            error_detail = error_data["detail"]
                    except Exception as json_error:
                        print(f"Error parsing response: {str(json_error)}")

                    return ForgotPasswordError(message=error_detail, code=error_code)

                # Procesar la respuesta exitosa
                recovery_data = response.json()
                print("Recovery data: ", recovery_data)

                return ForgotPasswordSuccess(
                    message="Si el correo existe en nuestra base de datos, recibirás instrucciones para restablecer tu contraseña",
                    code=recovery_data["code"],
                    token=recovery_data["token"],
                )

        except Exception as e:
            print(f"Error en forgotPassword: {str(e)}")
            return ForgotPasswordError(
                message="Error al procesar la solicitud de restablecimiento de contraseña",
                code="SERVER_ERROR",
            )

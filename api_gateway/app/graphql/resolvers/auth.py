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

# Importar funciones de la base de datos simulada para autenticación
from app.utils.mock_db import (
    get_user_by_email,
    get_user_by_id,
    generate_mock_token,
    add_user,
    verify_mock_token,
)


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
    name: Optional[str] = None
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


# Eliminamos las clases de entrada ya que usaremos argumentos directos


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
        auth_header = info.context["request"].headers.get("authorization")

        if not auth_header:
            return None

        try:
            # Extraer el token del encabezado de autorización
            scheme, token = auth_header.split()
            if scheme.lower() != "bearer":
                return None

            # Verificar el token
            user_data = verify_mock_token(token)
            if not user_data:
                return None

            return User(
                id=user_data["id"],
                username=user_data["username"],
                email=user_data["email"],
                name=user_data.get("name"),
                avatar=user_data.get("avatar"),
                role=user_data["role"],
                createdAt=user_data["createdAt"],
                updatedAt=user_data.get("updatedAt"),
            )
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
            name=user_data.get("name"),
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
            # Validar que se hayan proporcionado credenciales
            if not email or not password:
                return AuthError(
                    message="Correo y contraseña son requeridos", code="INVALID_INPUT"
                )

            # Preparar los datos para el microservicio de autenticación
            auth_service_url = os.getenv("AUTH_SERVICE_URL", "http://localhost:8000")
            login_url = f"{auth_service_url}/auth/login"
            print("Login URL: ", login_url)

            # Utilizar el cliente HTTP para realizar la petición al microservicio
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Realizar la petición al microservicio de autenticación
                # Nota: el microservicio espera 'username' como el correo y 'password'
                response = await client.post(
                    login_url,
                    json={"username": email, "password": password}
                )
                print("Response: ", response)
                
                # Log para depuración
                print(f"Login request to {login_url} - Status: {response.status_code}")
                
                # Si hay un error HTTP, devolver un error de autenticación
                if response.status_code != 200:
                    error_detail = "Credenciales inválidas"
                    try:
                        error_data = response.json()
                        if "detail" in error_data:
                            error_detail = error_data["detail"]
                    except Exception as json_error:
                        print(f"Error parsing response: {str(json_error)}")
                    
                    return AuthError(
                        message=error_detail,
                        code="AUTHENTICATION_ERROR"
                    )
                
                # Procesar la respuesta exitosa
                auth_data = response.json()
                
                # Mapear la respuesta del microservicio al formato GraphQL
                user_data = auth_data.get("user", {})
                
                return AuthSuccess(
                    user=User(
                        id=str(user_data.get("id", "")),
                        username=user_data.get("username", ""),
                        email=user_data.get("email", ""),
                        name=user_data.get("full_name"),
                        # El microservicio no devuelve avatar, usamos None
                        avatar=None,
                        # Convertir is_superuser a ADMIN o mantener STUDENT como default
                        role="ADMIN" if user_data.get("is_superuser") else "STUDENT",
                        createdAt=user_data.get("created_at", ""),
                        # El microservicio no devuelve updated_at, usamos None
                        updatedAt=None,
                    ),
                    token=auth_data.get("token", ""),
                    refreshToken=auth_data.get("token_refresh", ""),
                    expiresAt=auth_data.get("exp", ""),
                )

        except Exception as e:
            # En producción, se debería registrar este error en un sistema de monitoreo
            print(f"Login error: {str(e)}")
            return AuthError(
                message="Error inesperado al iniciar sesión", code="SERVER_ERROR"
            )

    @strawberry.mutation
    async def register(
        self,
        username: str,
        email: str,
        password: str,
        name: Optional[str] = None,
        role: Optional[UserRole] = None,
    ) -> AuthResult:
        """
        Registra un nuevo usuario en el sistema.

        Args:
            input (RegisterInput): Datos del nuevo usuario

        Returns:
            AuthSuccess: Token de autenticación e información del usuario

        Raises:
            Exception: Si el usuario ya existe
        """
        # Crear nuevo usuario
        # En producción, la contraseña debería estar hasheada
        hashed_password = f"hashed_{password}"  # Esto es un ejemplo, usar bcrypt o similar en producción

        new_user = add_user(
            username=username,
            email=email,
            password=hashed_password,
            name=name,
            role=role or "STUDENT",
        )

        if not new_user:
            return AuthError(
                message="El usuario ya existe con este correo o nombre de usuario",
                code="USER_ALREADY_EXISTS",
            )

        # Generar token de autenticación
        token_data = generate_mock_token(new_user["id"])

        return AuthSuccess(
            user=User(
                id=new_user["id"],
                username=new_user["username"],
                email=new_user["email"],
                name=new_user.get("name"),
                avatar=new_user.get("avatar"),
                role=new_user["role"],
                createdAt=new_user["createdAt"],
                updatedAt=new_user.get("updatedAt"),
            ),
            token=token_data["token"],
            refreshToken=token_data["refreshToken"],
            expiresAt=token_data["expiresAt"],
        )

    @strawberry.mutation
    async def refreshToken(self, refreshToken: str) -> AuthSuccess:
        """
        Renueva el token de autenticación usando un refresh token.

        Args:
            refreshToken (str): Token de refresco obtenido durante el login

        Returns:
            AuthSuccess: Nuevo token e información del usuario

        Raises:
            Exception: Si el refresh token es inválido o el usuario no existe
        """
        if not refreshToken or not refreshToken.startswith("mock-refresh-token-"):
            raise Exception("Token de refresco inválido")

        # Extraer el ID de usuario del token
        parts = refreshToken.split("-")
        if len(parts) < 4:
            raise Exception("Formato de token de refresco inválido")

        user_id = parts[3]
        user_data = get_user_by_id(user_id)

        if not user_data:
            raise Exception("Usuario no encontrado")

        # Generar un nuevo token de autenticación
        token_data = generate_mock_token(user_data["id"])

        return AuthSuccess(
            user=User(
                id=user_data["id"],
                username=user_data["username"],
                email=user_data["email"],
                name=user_data.get("name"),
                avatar=user_data.get("avatar"),
                role=user_data["role"],
                createdAt=user_data["createdAt"],
                updatedAt=user_data.get("updatedAt"),
            ),
            token=token_data["token"],
            refreshToken=token_data["refreshToken"],
            expiresAt=token_data["expiresAt"],
        )

    @strawberry.mutation
    async def logout(self) -> bool:
        """
        Cierra la sesión del usuario actual.

        Nota: En una implementación real, esto invalidaría el token.

        Returns:
            bool: Siempre retorna True indicando éxito
        """
        # En una implementación real, aquí se invalidaría el token
        return True

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
    async def confirmResetPassword(self, token: str, newPassword: str) -> bool:
        # In a mock implementation, just validate the token format
        if not token or not token.startswith("mock-reset-token-"):
            return False

        return True

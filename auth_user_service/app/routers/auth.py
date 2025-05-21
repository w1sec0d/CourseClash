from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, Dict, Any, Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import text
import bcrypt
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Importación de funciones para codificación y decodificación del token
from ..core.security import (
    encode_token,
    decode_token,
    generate_verification_code,
    verify_password,
    hash_password,
)

# Importación de modelos
from ..models.user import User, UserCreate, UserInterno
from ..models.login import Login, Email, UpdatePassword

# Conexión de la base de datos
from ..db import get_db

# Importación de servicios
from ..services import auth_service
from ..utils.config import USE_MOCK_DATA
from ..utils import mock_db
from ..utils.mock_db import (
    verify_email_mock,
    get_user_by_email_mock,
    update_password_mock,
    register_user_mock,
    get_user_by_id_mock,
)


# Definición de códigos de error
class AuthErrorCode:
    UNKNOWN_ERROR = "UNKNOWN_ERROR"
    USER_NOT_FOUND = "USER_NOT_FOUND"
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    SERVER_ERROR = "SERVER_ERROR"
    INVALID_CODE = "INVALID_CODE"
    EMAIL_EXISTS = "EMAIL_EXISTS"
    INVALID_TOKEN = "INVALID_TOKEN"
    TOKEN_EXPIRED = "TOKEN_EXPIRED"


router = APIRouter(prefix="/auth", tags=["auth"])

# ============================================
# Mock Data and Helper Functions
# ============================================

# Usuarios simulados
mock_users = [
    {
        "id": 1,
        "username": "admin",
        "email": "admin@gmail.com",
        "password": bcrypt.hashpw(
            "password123".encode("utf-8"), bcrypt.gensalt()
        ).decode(
            "utf-8"
        ),  # contraseña: password123
        "full_name": "Administrador",
        "is_active": True,
        "is_superuser": True,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    },
    {
        "id": 2,
        "username": "profesor",
        "email": "profesor@gmail.com",
        "password": bcrypt.hashpw(
            "password123".encode("utf-8"), bcrypt.gensalt()
        ).decode(
            "utf-8"
        ),  # contraseña: password123
        "full_name": "Profesor Ejemplo",
        "is_active": True,
        "is_superuser": False,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    },
    {
        "id": 3,
        "username": "estudiante",
        "email": "estudiante@gmail.com",
        "password": bcrypt.hashpw(
            "password123".encode("utf-8"), bcrypt.gensalt()
        ).decode(
            "utf-8"
        ),  # contraseña: password123
        "full_name": "Estudiante Ejemplo",
        "is_active": True,
        "is_superuser": False,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    },
    {
        "id": 4,
        "username": "estudiante2",
        "email": "cadavid4003@gmail.com",
        "password": bcrypt.hashpw(
            "password123".encode("utf-8"), bcrypt.gensalt()
        ).decode(
            "utf-8"
        ),  # contraseña: password123
        "full_name": "Estudiante Ejemplo",
        "is_active": True,
        "is_superuser": False,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    },
]


def to_tuple(user: Dict) -> Tuple:
    """Convierte un diccionario de usuario a una tupla del formato esperado"""
    return (
        user["id"],
        user["username"],
        user["email"],
        user["password"],
        user["full_name"],
        user["is_active"],
        user["is_superuser"],
        user["created_at"],
    )


def verify_email_mock(email: str) -> bool:
    """Verifica si un email existe en la base de datos simulada"""
    return any(user["email"] == email for user in mock_users)


def get_user_by_email_mock(email: str) -> Dict:
    """Obtiene un usuario por su email de la base de datos simulada"""
    for user in mock_users:
        if user["email"] == email:
            # Convertimos a tupla para mantener el formato esperado por transform_user
            user_tuple = to_tuple(user)
            # Creamos un UserInterno para mantener la consistencia con la implementación real
            user_obj = UserInterno(
                id=user["id"],
                username=user["username"],
                email=user["email"],
                password=user["password"],
                full_name=user["full_name"],
                is_active=user["is_active"],
                is_superuser=user["is_superuser"],
                created_at=user["created_at"],
            )
            return {"success": True, "user": user_obj}
    return {"success": False}


def update_password_mock(email: str, new_password: str) -> Dict[str, Any]:
    """Actualiza la contraseña de un usuario en la base de datos simulada"""
    for user in mock_users:
        if user["email"] == email:
            user["password"] = new_password
            return {"success": True, "message": "Password updated successfully"}
    return {"success": False, "error": "User not found"}


def register_user_mock(
    username: str,
    email: str,
    password: str,
    full_name: str,
    is_active: bool = True,
    is_superuser: bool = False,
) -> Dict[str, Any]:
    """Registra un nuevo usuario en la base de datos simulada"""
    # Verificar si el usuario ya existe
    if verify_email_mock(email):
        return {"success": False, "error": "User with this email already exists"}

    # Asignar un nuevo ID (el máximo actual + 1)
    next_id = max(user["id"] for user in mock_users) + 1 if mock_users else 1

    # Crear el nuevo usuario
    new_user = {
        "id": next_id,
        "username": username,
        "email": email,
        "password": bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
            "utf-8"
        ),
        "full_name": full_name,
        "is_active": is_active,
        "is_superuser": is_superuser,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    mock_users.append(new_user)
    return {"success": True, "user": new_user}


def get_user_by_id_mock(user_id: int) -> Optional[Dict[str, Any]]:
    """Obtiene un usuario por su ID de la base de datos simulada"""
    for user in mock_users:
        if user["id"] == user_id:
            return user
    return None


# ============================================
# API Endpoints
# ============================================


# Ruta que permite autenticar un usuario y genera un token si el usuario es valido
# Input: username debe ser el correo y password
# Salida: Un objeto con la informacion del usuario, token, token de refresco y expiracion del token
@router.post("/login")
def login(form_data: Login, db: Session = Depends(get_db)):
    try:
        # Obtiene toda la información del usuario
        if USE_MOCK_DATA:
            user_data = get_user_by_email_mock(form_data.username)
        else:
            user_data = auth_service.get_user_by_email(form_data.username)

        if not user_data.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "message": "Correo electrónico o contraseña inválidos",
                    "code": AuthErrorCode.INVALID_CREDENTIALS,
                },
            )

        # Verificar contraseña
        if not verify_password(form_data.password, user_data["user"].password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "message": "Correo electrónico o contraseña inválidos",
                    "code": AuthErrorCode.INVALID_CREDENTIALS,
                },
            )

        # Generar token
        payload = {
            "id": user_data["user"].id,
            "email": user_data["user"].email,
            "is_superuser": (
                user_data["user"].is_superuser
                if hasattr(user_data["user"], "is_superuser")
                else False
            ),
        }

        token, token_refresh, exp = encode_token(payload)

        print("🔑 Token:", token)
        print("🔑 Token refresh:", token_refresh)
        print("🔑 Exp:", exp)

        return {
            "user": user_data["user"],
            "token": token,
            "token_refresh": token_refresh,
            "exp": exp,
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": f"Unexpected error occurred, please try again later: {str(e)}",
                "code": AuthErrorCode.SERVER_ERROR,
            },
        )


# Ruta que permite obtener la información del usuario autenticado
# Input: token de acceso en el header
# Outpur: Objeto de tipo User (ver modelo User)


@router.get("/me")
def get_current_user(user: Annotated[dict, Depends(decode_token)]) -> User:
    print("🔑 User!!!:", user)
    if USE_MOCK_DATA:
        user_obj = get_user_by_id_mock(user["id"])
        if not user_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user_obj

    try:
        db: Session = next(get_db())
        query = text(""" SELECT * FROM users where id = :id""")
        result = db.execute(query, {"id": user["id"]}).fetchone()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        print("🔑 Result!!!:", result)

        # Create User object
        user_obj = User(
            id=result[0],
            username=result[1],
            email=result[2],
            full_name=result[4],
            is_active=bool(result[5]),
            is_superuser=bool(result[6]),
            created_at=str(result[7]),
            avatar_url=result[8],
            bio=result[9],
            experience_points=result[10],
        )

        # Debug print the created user object
        print("🔑 Created User object:", user_obj)

        return user_obj
    except HTTPException as e:
        raise e
    except Exception as e:
        print("❌ Error creating user:", str(e))  # Add error logging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en el servidor {e}",
        )


# Ruta para refrescar el token
# Input: token de refresco
# Output : json con informacion del usuario, token, token de refresco y expiracion del token
@router.post("/refresh")
def refresh_token(user: Annotated[dict, Depends(decode_token)]):
    try:
        # Si estamos usando datos simulados
        if USE_MOCK_DATA:
            user_data = get_user_by_email_mock(user["email"])
        else:
            user_data = auth_service.get_user_by_email(user["email"])

        if not user_data.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        payload = {
            "id": user["id"],
            "email": user["email"],
            "is_superuser": (
                user_data["user"].is_superuser
                if hasattr(user_data["user"], "is_superuser")
                else False
            ),
        }

        # Generar token y su expiración
        token, token_refresh, exp = encode_token(payload)

        return {
            "user": user_data["user"],
            "token": token,
            "token_refresh": token_refresh,
            "exp": exp,
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Error refreshing token {e}",
        )


# Ruta para recuperar la contraseña
# Input: email
# Output : Json con token, expiración y mensaje de éxito
@router.post("/recovery")
async def recovery_password(email: Email, db: Session = Depends(get_db)):
    try:
        # Verificar si el correo se encuentra registrado
        if USE_MOCK_DATA:
            email_exists = verify_email_mock(email.email)
        else:
            email_exists = auth_service.verify_email(email.email)

        if not email_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "Email not registered",
                    "code": AuthErrorCode.USER_NOT_FOUND,
                },
            )

        # Generar un codigo de verificación
        code = generate_verification_code()

        payload = {"email": email.email, "code": code}
        # Generar token
        token, refresh_token, exp = encode_token(payload, expiration_minutes=5)

        # generar body del correo
        body = f"""
            <h1>¿Olvidaste tu contraseña? Solucionémoslo juntos</h1>
            <p>Para recuperar tu contraseña, ingresa el codigo enviado a tu correo:</p>
            <h2>{code}</h2>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        """

        # Enviar correo
        subject = "Recuperación de contraseña"

        # En modo mock, solo mostramos el código en la consola
        if not USE_MOCK_DATA:
            await auth_service.send_email(
                subject=subject, email_to=email.email, body=body
            )
        else:
            print(f"\n=== MOCK EMAIL ===")
            print(f"To: {email.email}")
            print(f"Subject: {subject}")
            print(f"Body: {body}")
            print("=================\n")

        return {
            "success": True,
            "message": "Email sent successfully",
            "exp": exp,
            "code": code,  # Incluimos el código en la respuesta para desarrollo
            "token": token,
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": f"Error sending email: {str(e)}",
                "code": AuthErrorCode.SERVER_ERROR,
            },
        )


# Endpoint para cambiar contraseña
# Input: Data contraseña nueva y el token
# Output: Mensaje de confirmación
@router.post("/update-password")
def update_password(
    data: UpdatePassword,
    token: Annotated[dict, Depends(decode_token)],
    db: Session = Depends(get_db),
):
    print("🔑 Token recibido:", token)
    print("🔑 Data recibida:", data)
    try:
        # Verificar que el token contenga el email y el código
        if "email" not in token or "code" not in token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "Invalid token: missing required information",
                    "code": AuthErrorCode.INVALID_TOKEN,
                },
            )

        # Verificar que el email coincida
        if token["email"] != data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "Email does not match token",
                    "code": AuthErrorCode.INVALID_TOKEN,
                },
            )

        # Verificar que el código coincida
        if token["code"] != data.code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "Invalid verification code",
                    "code": AuthErrorCode.INVALID_CODE,
                },
            )

        # Generar la contraseña hasheada
        hashed_password = hash_password(data.password)

        # Si estamos usando datos simulados
        if USE_MOCK_DATA:
            result = update_password_mock(data.email, hashed_password)
            if not result["success"]:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=result.get("error", "Error updating password"),
                )
            return result

        # Si estamos usando la base de datos real
        query = text(
            """UPDATE users SET hashed_password = :password WHERE email = :email"""
        )
        db.execute(query, {"password": hashed_password, "email": data.email})
        db.commit()

        return {"success": True, "message": "Password updated successfully"}

    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": f"Error updating password: {str(e)}",
                "code": AuthErrorCode.SERVER_ERROR,
            },
        )


# Ruta para registrar un nuevo usuario
# Input: Información del usuario (username, email, password, full_name, is_active, is_superuser)
# Output: Mensaje de éxito
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        logger.info("🔑 Register request:")
        # Verificar si el correo ya está registrado
        if USE_MOCK_DATA:
            # Crear usuario en datos mock
            result = register_user_mock(
                username=user.username,
                email=user.email,
                password=user.password,
                full_name=user.full_name,
                is_active=user.is_active,
                is_superuser=user.is_superuser,
            )

            if not result["success"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=result.get("error", "Error al registrar el usuario"),
                )

            # Generate token for mock user
            payload = {
                "id": result["user"]["id"],
                "email": user.email,
                "is_superuser": result["user"]["is_superuser"],
            }

            token, token_refresh, exp = encode_token(payload)

            return {
                "message": "User created successfully",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "fullName": user.full_name,
                    "avatar": None,
                    "role": "ADMIN" if result["user"]["is_superuser"] else "STUDENT",
                    "createdAt": result["user"]["created_at"],
                    "updatedAt": None,
                },
                "token": token,  # Add token
                "token_refresh": token_refresh,  # Add refresh token
                "exp": exp,  # Add expiration
            }

        # Si no estamos en modo mock, usar la base de datos real
        if USE_MOCK_DATA:
            email_exists = verify_email_mock(user.email)
        else:
            email_exists = auth_service.verify_email(user.email)

        if email_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "Email already registered",
                    "code": AuthErrorCode.EMAIL_EXISTS,
                },
            )

        # Cifrado de contraseña
        password_hash = hash_password(user.password)

        query = text(
            """
                    INSERT INTO users (username, email, hashed_password, full_name, is_active, is_superuser) 
                    VALUES (:username, :email, :password_hash, :full_name, :is_active, :is_superuser)
                """
        )

        db.execute(
            query,
            {
                "username": user.username,
                "email": user.email,
                "password_hash": password_hash,
                "full_name": user.full_name,
                "is_active": 1 if user.is_active else 0,
                "is_superuser": 1 if user.is_superuser else 0,
            },
        )
        db.commit()

        # Get the ID of the newly created user
        get_id_query = text(
            "SELECT id, created_at, is_active, is_superuser FROM users WHERE email = :email"
        )
        result = db.execute(get_id_query, {"email": user.email}).fetchone()

        # Generate token for the new user
        payload = {
            "id": result[0],
            "email": user.email,
            "is_superuser": bool(result[3]),
        }

        token, token_refresh, exp = encode_token(payload)

        return {
            "message": "User created successfully",
            "user": {
                "id": str(result[0]) if result else None,
                "username": user.username,
                "email": user.email,
                "fullName": user.full_name,
                "avatar": None,
                "role": "ADMIN" if bool(result[3]) else "STUDENT",
                "createdAt": str(result[1]) if result and len(result) > 1 else None,
                "updatedAt": None,
            },
            "token": token,  # Add token
            "token_refresh": token_refresh,  # Add refresh token
            "exp": exp,  # Add expiration
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        logger.error("Error creating user: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "message": f"Error creating user: {str(e)}",
                "code": AuthErrorCode.SERVER_ERROR,
            },
        )

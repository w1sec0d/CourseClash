"""
Base de datos simulada para el servicio de autenticación

Este módulo proporciona funciones para simular operaciones de base de datos
sin necesidad de conectarse a una BD real. Esto es útil para desarrollo
y pruebas.
"""

from datetime import datetime
from ..models.user import UserInterno, User
import bcrypt
from typing import Dict, List, Optional, Union, Tuple

# Usuarios simulados
mock_users = [
    {
        "id": 1,
        "username": "admin",
        "email": "admin@gmail.com",
        "password": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),  # contraseña: password123
        "full_name": "Administrador",
        "is_active": True,
        "is_superuser": True,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    },
    {
        "id": 2,
        "username": "profesor",
        "email": "profesor@gmail.com",
        "password": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),  # contraseña: password123
        "full_name": "Profesor Ejemplo",
        "is_active": True,
        "is_superuser": False,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    },
    {
        "id": 3,
        "username": "estudiante",
        "email": "estudiante@gmail.com",
        "password": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),  # contraseña: password123
        "full_name": "Estudiante Ejemplo",
        "is_active": True,
        "is_superuser": False,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
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
        user["created_at"]
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
                created_at=user["created_at"]
            )
            return {"success": True, "user": user_obj}
    
    return {"success": False}

def create_user_mock(user_data: Dict) -> Dict:
    """Crea un nuevo usuario en la base de datos simulada"""
    # Verificar si el usuario ya existe
    if verify_email_mock(user_data["email"]):
        return {"success": False, "error": "User with this email already exists"}
    
    # Asignar un nuevo ID (el máximo actual + 1)
    next_id = max(user["id"] for user in mock_users) + 1
    
    # Crear el nuevo usuario
    new_user = {
        "id": next_id,
        "username": user_data["username"],
        "email": user_data["email"],
        "password": user_data["password"],  # Se asume que ya viene hasheada
        "full_name": user_data.get("full_name", ""),
        "is_active": user_data.get("is_active", True),
        "is_superuser": user_data.get("is_superuser", False),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Agregar a la lista de usuarios
    mock_users.append(new_user)
    
    # Convertir a UserInterno y devolver
    user_obj = UserInterno(
        id=new_user["id"],
        username=new_user["username"],
        email=new_user["email"],
        password=new_user["password"],
        full_name=new_user["full_name"],
        is_active=new_user["is_active"],
        is_superuser=new_user["is_superuser"],
        created_at=new_user["created_at"]
    )
    
    return {"success": True, "user": user_obj}

def update_password_mock(email: str, new_password: str) -> Dict:
    """Actualiza la contraseña de un usuario en la base de datos simulada"""
    for user in mock_users:
        if user["email"] == email:
            user["password"] = new_password
            return {"success": True, "message": "Password updated successfully"}
    
    return {"success": False, "error": "User not found"}

def register_user_mock(username: str, email: str, password: str, full_name: str, 
                     is_active: bool = True, is_superuser: bool = False) -> Dict:
    """
    Registra un nuevo usuario en la base de datos simulada
    
    Args:
        username: Nombre de usuario
        email: Correo electrónico
        password: Contraseña (sin hashear)
        full_name: Nombre completo
        is_active: Si el usuario está activo
        is_superuser: Si el usuario es administrador
        
    Returns:
        Dict con el resultado de la operación
    """
    # Verificar si el correo ya existe
    if verify_email_mock(email):
        return {"success": False, "error": "Email already registered"}
    
    # Verificar si el nombre de usuario ya existe
    if any(user["username"] == username for user in mock_users):
        return {"success": False, "error": "Username already taken"}
    
    # Asignar un nuevo ID (el máximo actual + 1)
    next_id = max(user["id"] for user in mock_users) + 1
    
    # Crear el nuevo usuario
    new_user = {
        "id": next_id,
        "username": username,
        "email": email,
        "password": password,  # No se hashea aquí porque se espera que ya venga hasheado
        "full_name": full_name,
        "is_active": is_active,
        "is_superuser": is_superuser,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Agregar a la lista de usuarios
    mock_users.append(new_user)
    
    return {
        "success": True,
        "user_id": next_id,
        "message": "User registered successfully"
    }


def get_user_by_id_mock(user_id: int) -> Optional[User]:
    """Obtiene un usuario por su ID de la base de datos simulada"""
    for user in mock_users:
        if user["id"] == user_id:
            # Convertimos a User para la respuesta
            return User(
                id=user["id"],
                username=user["username"],
                email=user["email"],
                full_name=user["full_name"],
                is_active=user["is_active"],
                is_superuser=user["is_superuser"],
                created_at=user["created_at"]
            )
    
    return None

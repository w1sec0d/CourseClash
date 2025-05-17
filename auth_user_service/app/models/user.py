from pydantic import BaseModel
from typing import Optional

# Modelo de usuario de la base de datos sin contraseña para enviar al cliente
class User(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    is_active: bool
    is_superuser: bool
    created_at: str

# Modelo de usuario de la base de datos con contraseña para gestionar la autenticación
class UserInterno(BaseModel):
    id: int
    username: str
    email: str
    password: str
    full_name: str
    is_active: bool
    is_superuser: bool
    created_at: str

# Modelo de usuario para el registro de un usuario
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False

# Modelo de usuario para la actualización de este
class UserUpdate(BaseModel):
    username: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
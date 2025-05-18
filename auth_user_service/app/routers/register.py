from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text

#Imporatación de esquema de usuario
from ..models.user import UserCreate

#Conexion de la base de datos
from ..db import get_db
from ..core import security

#servicio de verificación de correo
from ..services.auth_service import verify_email

router = APIRouter(prefix='/register', tags=['register'])


# Ruta para registrar un nuevo usuario
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:

        # Verificar si el correo ya está registrado
        if verify_email(user.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Cifrado contraseña
        password_hash = security.hash_password(user.password)

        query = text("""
                        INSERT INTO users (username, email, hashed_password, full_name, is_active, is_superuser) 
                        VALUES (:username, :email, :password, :full_name, :is_active, :is_superuser)
                    """)

        db.execute(query, {
            'username': user.username,
            'email': user.email,
            'password': password_hash,
            'full_name': user.full_name,
            'is_active': user.is_active,
            'is_superuser': user.is_superuser
        })

        db.commit()
        
        return {
            "success": True,
            "message": "User created successfully"
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Error creating user {e}'
        )
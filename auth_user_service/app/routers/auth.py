from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import text

#Impotación de funciones para codificación y decodificación del token
from ..core.security import encode_token, decode_token

#Imporatación de esquema de usuario
from ..models.user import UserCreate

#Conexion de la base de datos
from ..db import get_db

from ..core import security

router = APIRouter(prefix='/auth', tags=['auth'])

#Base de datos prueba
fake_users_db = {
    "user1@example.com": {
        "id": 1,
        "name": "John Doe",
        "email": "user1@example.com",
        "password": "password123",
        "roles": ["user"],
    },
    "admin@example.com": {
        "id": 2,
        "name": "Admin User",
        "email": "admin@example.com",
        "password": "adminpass",
        "roles": ["admin"],
    },
}

@router.post('/token')
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = fake_users_db.get(form_data.username)


    if not user or user.get("password") != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = encode_token({'email': user['email'], 'id': user['id']})
    return  {'access_token': token}

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
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



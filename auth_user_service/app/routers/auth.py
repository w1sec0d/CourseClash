from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import text

#Impotación de funciones para codificación y decodificación del token
from ..core.security import encode_token, decode_token

#Imporatación de esquema de usuario
from ..models.user import UserCreate, User
from ..models.login import Login
from ..models.login import loginResponse

#Conexion de la base de datos
from ..db import get_db

from ..core import security
from ..services import auth_service

#servicio de verificación de correo
from ..services.auth_service import verify_email

router = APIRouter(prefix='/auth', tags=['auth'])

# Ruta que permite autenticar un usuario y genera un token si el usuario es valido
@router.post('/token')
def login(form_data: Login, db: Session = Depends(get_db)):
    try:

        # Obtiene toda la información del usuario
        user = auth_service.get_user_by_email(form_data.username)

        # Verificar contraseña
        if security.verify_password(form_data.password, user.password) == False:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Invalid credentials'
            )
        
        # Generar token
        
        payload = {
            'id': user.id,
            'email': user.email
        }

        # Generar token y su expiración
        token, token_refresh, exp = encode_token(payload)

        return  {'user': user, 'token': token, 'token_refresh': token_refresh, 'exp': exp}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f'Error logging in {e}'
        )

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

# Ruta que permite obtener la información del usuario autenticado
@router.get('/me')
def get_current_user(user: Annotated[dict, Depends(decode_token)]) -> User:

    db: Session = next(get_db())
    query = text(""" SELECT * FROM users where id = :id""")
    result = db.execute(query, {'id': user['id']}).fetchone()
    if not result: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='User not found'
        )
    user = User(
        id=result[0],
        username=result[1],
        email=result[2],
        full_name=result[4],
        is_active=result[5],
        is_superuser=result[6],
        created_at=str(result[7])
    )

    return user

@router.post('/refresh')
def refresh_token(user: Annotated[dict, Depends(decode_token)]):
    try:
        payload = {
            'id': user['id'],
            'email': user['email']
        }

        # Obtiene toda la información del usuario
        user = auth_service.get_user_by_email(user['email'])

        # Generar token y su expiración
        token, token_refresh, exp = encode_token(payload)

        return  {'user': user, 'token': token, 'token_refresh': token_refresh, 'exp': exp}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f'Error refreshing token {e}'
        )
    




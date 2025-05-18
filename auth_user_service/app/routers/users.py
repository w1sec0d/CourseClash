from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..db import get_db

from ..core.security import decode_token
from ..models.user import User, UserUpdate

router = APIRouter(prefix='/users', tags=['users'])

#Ruta que obtiene los usuarios de la aplicación 
#Input: 
#Output: Lista de jsons con la información de cada usuario
@router.get('/users')
def get_users(db: Session = Depends(get_db)):
    try: 
        result = db.execute(text("SELECT * FROM users")).mappings().all()
        users = [row for row in result]
        return users
    except Exception as e:
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = f'Error en el servidor {e}'
        )

# Ruta que permite obtener un usuario en especifico por su id
#Input: id del usuario como parametro en la ruta
#Output: json con la información del usuario a buscar
@router.get('/user/{id}')
def get_user(id: int, db: Session = Depends(get_db)):
    try:
        query = text("SELECT * FROM users WHERE id = :id")
        user = db.execute(query, {'id': id}).mappings().first()

        if not user:
            raise HTTPException(
                status_code= status.HTTP_404_NOT_FOUND,
                detail='User not found'
            )
        
        return user
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = f'Error en el servidor {e}'
        )

# Ruta que permite actualizar un usuario en especifico por su id
#Input: id del usuario a actualizar en la ruta
#Output: json con mensaje de información exitosa o algun error en el servidor
@router.put('/user/{id}')
def update_user(id: int, user: UserUpdate, current_user: Annotated[dict, Depends(decode_token)]):
    
    try:
        db : Session = next(get_db())
        query = text('UPDATE users SET username = :username, full_name = :full_name, is_active = :is_active, is_superuser = :is_superuser WHERE id = :id')
        
        db.execute(query, {
            'username': user.username,
            'full_name': user.full_name,
            'is_active': user.is_active,
            'is_superuser': user.is_superuser,
            'id': id
        })

        db.commit()

        return {'success': True, 'message': 'User updated successfully'}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Error updating user {e}'
        )

















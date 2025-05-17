from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..db import get_db

from ..core.security import decode_token
from ..models.user import User, UserUpdate

router = APIRouter(prefix='/users', tags=['users'])

# Ruta que permite obtener todos los usuarios
@router.get('/users')
def get_users(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM users"))
    users = [User(id=row[0], username=row[1], email=row[2], full_name=row[4], 
                is_active=row[5], is_superuser=row[6], created_at=str(row[7])) for row in result]
    return users

# Ruta que permite obtener un usuario en especifico por su id
@router.get('/user/{id}')
def get_user(id: int, db: Session = Depends(get_db)) -> User:
    query = text("SELECT * FROM users WHERE id = :id")
    result = db.execute(query, {'id': id}).fetchone()

    if not result:
        raise HTTPException(
            status_code= status.HTTP_404_NOT_FOUND,
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

@router.put('/user/{id}')
def update_user(id: int, user: UserUpdate, current_user: Annotated[dict, Depends(decode_token)]):
    
    try:
        db : Session = next(get_db())
        query = text('UPDATE users SET username = :username, email = :email, full_name = :full_name, is_active = :is_active, is_superuser = :is_superuser WHERE id = :id')
        
        db.execute(query, {
            'username': user.username,
            'email': user.email,
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

















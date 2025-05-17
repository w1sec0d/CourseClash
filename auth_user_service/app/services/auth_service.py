from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..db import get_db
from ..models.user import UserInterno



# Dado los datos de un usuario en formato tupla, transforma los datos a un objeto de tipo User
def transform_user(user: tuple) -> UserInterno:
    return UserInterno(
        id=user[0],
        username=user[1],
        email=user[2],
        password=user[3],
        full_name=user[4],
        is_active=user[5],
        is_superuser=user[6],
        created_at=str(user[7])
    )

# Servicio de verificación de correo 
def verify_email(email: str) -> bool: 
    try: 
        db: Session = next(get_db())
        query = text(""" SELECT * FROM users WHERE email = :email""")
        user = db.execute(query, {'email': email})
        result = user.fetchone()
        
        if result: 
            return True
        else: 
            return False
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Error verifying email {e}'
        )
    

# Servicio para obtener la información de un usuario por su id. Retorna un objeto de tipo User
def get_user_by_email(email: str) -> UserInterno:
    try: 
        db: Session = next(get_db())
        query = text(""" SELECT * FROM users WHERE email = :email""")
        user = db.execute(query, {'email': email})
        result = user.fetchone()

        if not result: 
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='user o password incorrect'
            )
        
        user = transform_user(result)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Error verifying email {e}'
        )

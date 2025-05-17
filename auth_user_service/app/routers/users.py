from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..db import get_db


from ..models.user import User

router = APIRouter(prefix='/users', tags=['users'])

@router.get('/users')
def get_users(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM users"))
    users = [User(id=row[0], username=row[1], email=row[2], full_name=row[4], 
                is_active=row[5], is_superuser=row[6], created_at=str(row[7])) for row in result]
    return users

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







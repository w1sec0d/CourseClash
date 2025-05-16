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
                is_active=row[5], is_superuser=row[6]) for row in result]
    return users







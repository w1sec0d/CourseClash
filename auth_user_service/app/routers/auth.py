from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from jose import jwt
import os
from dotenv import load_dotenv
load_dotenv()



router = APIRouter(prefix='/auth', tags=['auth'])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = '/auth/token')

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

def encode_token(payload: dict) -> str:
    token = jwt.encode(payload, os.environ.get('SECRET'), algorithm="HS256") 
    return token

def decode_token(token: Annotated[str, Depends(oauth2_scheme)]) -> dict:
    try: 
        data = jwt.decode(token=token, key=os.environ["SECRET"], algorithms=["HS256"])
        return data
    except jwt.JWTError: 
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            success = False,
            message = "Invalid Token"
        )

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

@router.get('/me')
def profile(user : Annotated[dict, Depends(decode_token)]):
    return user
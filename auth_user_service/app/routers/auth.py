from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated


#Impotación de funciones para codificación y decodificación del token
from ..core.security import encode_token, decode_token

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

@router.get('/me')
def profile(user : Annotated[dict, Depends(decode_token)]):
    return user
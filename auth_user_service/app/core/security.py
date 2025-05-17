from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from dotenv import load_dotenv
from datetime import datetime, timedelta

import os 
import bcrypt


load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = '/auth/token')

#Función encargada de generar el token
def encode_token(payload: dict, expiration_minutes: int = 60) -> str:
    payload['exp'] = datetime.utcnow() + timedelta(minutes=expiration_minutes)
    token = jwt.encode(payload, os.environ.get('SECRET'), algorithm= os.environ.get('ALGORITM')) 
    return token

#Función encargada de validar el token y extraer la información
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
    
def hash_password(password: str) -> str: 
    salt = bcrypt.gensalt()
    hash_password = bcrypt.hashpw(password.encode(), salt)
    return hash_password.decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())
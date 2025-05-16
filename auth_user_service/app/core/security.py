from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
import os 
from dotenv import load_dotenv

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = '/auth/token')

#Función encargada de generar el token
def encode_token(payload: dict) -> str:
    token = jwt.encode(payload, os.environ.get('SECRET'), algorithm="HS256") 
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
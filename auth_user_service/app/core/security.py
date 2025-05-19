from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
#from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

import os 
import bcrypt
import secrets

#load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = '/auth/token')

#Función encargada de generar el token
#Input: paylod información que se quiere enviar en el token, expiration tiempo de expiracion del token
#Output: token, token de refresco y expiracion del token
def encode_token(payload: dict, expiration_minutes: int = 60) -> str:

    #Generación de token normal
    expiration = datetime.now(timezone.utc) + timedelta(minutes=expiration_minutes)
    payload['exp'] = expiration

    token = jwt.encode(payload, os.environ['SECRET'], algorithm= os.environ['ALGORITM']) 

    #Generación de token de refresco
    expiration = datetime.now(timezone.utc) + timedelta(days=1)
    payload['exp'] = expiration
    refresh_token = jwt.encode(payload, os.environ['SECRET'], algorithm= os.environ['ALGORITM'])
    
   
    return token, refresh_token, expiration.isoformat()

#Función encargada de validar el token y extraer la información
#Input: Token 
#Output: Informacion de carga del token id, email
def decode_token(token: Annotated[str, Depends(oauth2_scheme)]) -> dict:
    try: 
        data = jwt.decode(token=token, key=os.environ["SECRET"], algorithms=os.environ['ALGORITM'])

        return data
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Token has expired"
        )
    except jwt.JWTError: 
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail = "Invalid Token"
        )

# Funcion encargada de encriptar la contraseña
#Input: Contraseña
#Output: Contraseña hasheada
def hash_password(password: str) -> str: 
    salt = bcrypt.gensalt()
    hash_password = bcrypt.hashpw(password.encode(), salt)
    return hash_password.decode()

# Función encargada de verificar la contraseña del usuario
#Input: plain contraseña ingresa por el usuario, hashed contraseña almacenada en la bd
#Output: Booleano 
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


# Funcion de generar un codigo de verificación 
#Genera una hexadecimal de longitud 6
def generate_verification_code() -> str: 
    return secrets.token_urlsafe(6)[:6]

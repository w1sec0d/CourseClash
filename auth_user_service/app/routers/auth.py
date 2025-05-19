from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import text

#Impotación de funciones para codificación y decodificación del token
from ..core.security import encode_token, decode_token, generate_verification_code

#Imporatación de esquema de usuario
from ..models.user import User
from ..models.login import Login, Email, UpdatePassword



#Conexion de la base de datos
from ..db import get_db

from ..core import security
from ..services import auth_service

#servicio de verificación de correo
from ..services.auth_service import verify_email, send_email

router = APIRouter(prefix='/auth', tags=['auth'])

# Ruta que permite autenticar un usuario y genera un token si el usuario es valido
# Input: username debe ser el correo y password
# Salida: Un objeto con la informacion del usuario, token, token de refresco y expiracion del token
@router.post('/login')
def login(form_data: Login, db: Session = Depends(get_db)):
    try:
        # Obtiene toda la información del usuario
        user = auth_service.get_user_by_email(form_data.username)
        if user['success'] == False: 
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Verificar contraseña
        if not security.verify_password(form_data.password, user['user'].password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        # Generar token
        payload = {
            'id': user['user'].id,
            'email': user['user'].email,
            'is_superuser': user['user'].is_superuser
        }

        token, token_refresh, exp = encode_token(payload)

        return {'user':user['user'], 'token': token, 'token_refresh': token_refresh, 'exp': exp}
    
    except HTTPException as e:
        raise e  
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Unexpected error occurred, please try again later {e}.'
        )



# Ruta que permite obtener la información del usuario autenticado
# Input: token de acceso en el header
# Outpur: Objeto de tipo User (ver modelo User)

@router.get('/me')
def get_current_user(user: Annotated[dict, Depends(decode_token)]) -> User:

    db: Session = next(get_db())
    query = text(""" SELECT * FROM users where id = :id""")
    result = db.execute(query, {'id': user['id']}).fetchone()
    if not result: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
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

# Ruta para refrescar el token
# Input: token de refresco 
# Output : json con informacion del usuario, token, token de refresco y expiracion del token
@router.post('/refresh')
def refresh_token(user: Annotated[dict, Depends(decode_token)]):
    try:
        payload = {
            'id': user['id'],
            'email': user['email']
        }

        # Obtiene toda la información del usuario
        user = auth_service.get_user_by_email(user['email'])

        # Generar token y su expiración
        token, token_refresh, exp = encode_token(payload)

        return  {'user': user['user'], 'token': token, 'token_refresh': token_refresh, 'exp': exp}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f'Error refreshing token {e}'
        )

# Ruta para recuperar la contraseña
# Input: email
# Output : Json con token, expiración y mensaje de éxito
@router.post('/recovery')
async def recovery_password(email: Email, db: Session = Depends(get_db)):
    try:

        # Verificar si el correo se encuentra registrado
        if verify_email(email.email) == False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Email not registered'
            )

        # Generar un codigo de verificación
        code = generate_verification_code()

        payload = {
            'email': email.email,
            'code': code
        }
        # Generar token 

        token, refresh_token, exp = encode_token(payload, expiration_minutes=5)

        #Falta establecer la ruta de la pagina del front


        # generar body del correo 
        body = f"""
            <h1>¿Olvidaste tu contraseña? Solucionémoslo juntos</h1>
            <p>Para recuperar tu contraseña, ingresa el siguiente código en la aplicación:</p>
            <h2>{code}</h2>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        """

        # Enviar correo
        subject = "Recuperación de contraseña"

        send =  await send_email(
            subject= subject,
            email_to = email.email,
            body = body
        )

        return {
            'success': True,
            'message': 'Email sent successfully',
            'exp': exp
        }
    
    except HTTPException as e:
        raise e
    
    except Exception as e:
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = f'Error sending email {e}'
        )

    
#Endpoint para cambiar contraseña
#Input: Data contraseña nueva y el token 
#Output: Mensaje de confirmacion
@router.post('/update')
def update_password(data: UpdatePassword, token : Annotated[dict, Depends(decode_token)], db: Session = Depends(get_db)):
    try: 
        hashed_password = security.hash_password(data.password)
        query = text(""" UPDATE users SET hashed_password = :password WHERE email = :email""")

        db.execute(query, {'password': hashed_password, 'email': token['email']})

        
        db.commit()

        return {'success': True, 'message': 'User updated successfully'}

    except Exception as e:
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = f'Error al actualizar la contraseña {e}'
        )


    







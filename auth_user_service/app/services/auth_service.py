from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..db import get_db
from ..models.user import UserInterno
from fastapi_mail import FastMail, MessageSchema
from ..config import conf


# Dado los datos de un usuario en formato tupla, transforma los datos a un objeto de tipo User
# Input: una tupla con los datos del usuario
# Output: un objeto de tipo UserInterno
# Ejemplo de tupla: (1, 'username', 'email', 'hashed_password', 'full_name', is_active True, is superiority False, datetime)
# Ejemplo de objeto: UserInterno(id=1, username='username', email='email', password='hashed_password', full_name='full_name', is_active=True, is_superuser=False, created_at='2023-10-01 12:00:00')


def transform_user(user: tuple) -> UserInterno:
    return UserInterno(
        id=user[0],
        username=user[1],
        email=user[2],
        password=user[3],
        full_name=user[4],
        is_active=user[5],
        is_superuser=user[6],
        created_at=str(user[7]),
    )


# Servicio de verificación de correo
# Input: email
# Output: True si el correo se encuentra registrado, False si no
def verify_email(email: str) -> bool:
    try:
        db: Session = next(get_db())
        query = text(""" SELECT * FROM users WHERE email = :email""")
        user = db.execute(query, {"email": email})
        result = user.fetchone()

        if result:
            return True
        else:
            return False
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error verifying email {e}",
        )


# Servicio para obtener la información de un usuario por su id. Solo se utilizando de este microservicio
# Input: email
# Output: un objeto de tipo UserInterno
# Ejemplo de objeto: UserInterno(id=1, username='username', email='email', password='hashed_password', full_name='full_name', is_active=True, is_superuser=False, created_at='2023-10-01 12:00:00')
def get_user_by_email(email: str) -> UserInterno:
    try:
        db: Session = next(get_db())
        query = text(""" SELECT * FROM users WHERE email = :email""")
        user = db.execute(query, {"email": email})
        result = user.fetchone()

        if not result:
            return {"success": False}

        user = transform_user(result)
        return {"success": True, "user": user}
    except Exception as e:
        return {"success": False, "error": str(e)}


# Servicio para enviar un correo de recuperación de contraseña
# Input: subject: Asunto del mensaje, email_to: A quien va dirijido el correo, body
# Output: un objeto con el mensaje de éxito
async def send_email(subject: str, email_to: str, body: str):
    message = MessageSchema(
        subject=subject, recipients=[email_to], body=body, subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    return {"message": "Email sent successfully"}

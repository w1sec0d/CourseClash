from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..db import get_db

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
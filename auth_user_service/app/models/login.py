from pydantic import BaseModel

# Modelo para el inicio de sesion
class Login(BaseModel):
    username: str
    password: str

#Modelo para la respuesta de inicio de sesión
class loginResponse(BaseModel):
    user: dict
    token: str
    expiresAt: str
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

#Modelo para la recuperación de contraseña
class Email(BaseModel):
    email: str

#Modelo para verificar el codigo
class code(BaseModel):
    code: str

#Modelo para Actualizar la contraseña
class UpdatePassword(BaseModel):
    password: str


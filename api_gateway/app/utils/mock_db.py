from datetime import datetime

# Base de datos simulada para desarrollo/pruebas

# Base de datos de usuarios simulados
users = [
    {
        "id": "1",
        "username": "estudiante",
        "email": "estudiante@gmail.com",
        "name": "Estudiante",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
        "role": "STUDENT",
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat(),
    },
    {
        "id": "2",
        "username": "profesor",
        "email": "profesor@gmail.com",
        "name": "Profesor",
        "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1",
        "role": "TEACHER",
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat(),
    },
]

# Almacenamiento de tokens simulados
tokens = {}

# Helper functions for the mock database
def get_user_by_id(user_id):
    return next((user for user in users if user["id"] == user_id), None)

def get_user_by_email(email):
    return next((user for user in users if user["email"] == email), None)

def get_user_by_username(username):
    return next((user for user in users if user["username"] == username), None)

def generate_mock_token(user_id):
    """# Generar un token simulado para desarrollo"""
    token = f"mock-jwt-token-{user_id}-{datetime.now().timestamp()}"
    refresh_token = f"mock-refresh-token-{user_id}-{datetime.now().timestamp()}"
    
    tokens[token] = {
        "userId": user_id,
        "expiresAt": datetime.now().timestamp() + 3600,  # 1 hora de expiración
    }
    
    return {
        "token": token,
        "refreshToken": refresh_token,
        "expiresAt": datetime.fromtimestamp(datetime.now().timestamp() + 3600).isoformat(),
    }

def verify_mock_token(token):
    """# Verificar un token simulado para desarrollo"""
    if not token or not token.startswith("mock-jwt-token-"):
        return None
    
    # Extraer el ID de usuario del token
    parts = token.split("-")
    if len(parts) < 4:
        return None
    
    user_id = parts[3]
    return get_user_by_id(user_id)

def add_user(username, email, password, name=None, role="STUDENT"):
    """# Agregar un nuevo usuario a la base de datos simulada"""
    # Verificar si el usuario ya existe
    if get_user_by_email(email) or get_user_by_username(username):
        return None
    
    # Crear un nuevo usuario
    new_user = {
        "id": str(len(users) + 1),
        "username": username,
        "email": email,
        "name": name or username,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}",
        "role": role,
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat(),
    }
    
    users.append(new_user)
    return new_user

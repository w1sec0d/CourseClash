from datetime import datetime

# Mock database for development/testing

# Mock user database
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

# Mock token storage
tokens = {}

# Helper functions for the mock database
def get_user_by_id(user_id):
    return next((user for user in users if user["id"] == user_id), None)

def get_user_by_email(email):
    return next((user for user in users if user["email"] == email), None)

def get_user_by_username(username):
    return next((user for user in users if user["username"] == username), None)

def generate_mock_token(user_id):
    """Generate a mock token for development"""
    token = f"mock-jwt-token-{user_id}-{datetime.now().timestamp()}"
    refresh_token = f"mock-refresh-token-{user_id}-{datetime.now().timestamp()}"
    
    tokens[token] = {
        "userId": user_id,
        "expiresAt": datetime.now().timestamp() + 3600,  # 1 hour expiration
    }
    
    return {
        "token": token,
        "refreshToken": refresh_token,
        "expiresAt": datetime.fromtimestamp(datetime.now().timestamp() + 3600).isoformat(),
    }

def verify_mock_token(token):
    """Verify a mock token for development"""
    if not token or not token.startswith("mock-jwt-token-"):
        return None
    
    # Extract user ID from token
    parts = token.split("-")
    if len(parts) < 4:
        return None
    
    user_id = parts[3]
    return get_user_by_id(user_id)

def add_user(username, email, password, name=None, role="STUDENT"):
    """Add a new user to the mock database"""
    # Check if user already exists
    if get_user_by_email(email) or get_user_by_username(username):
        return None
    
    # Create new user
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

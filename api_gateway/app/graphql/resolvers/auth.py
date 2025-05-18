import strawberry
from typing import List, Optional
from datetime import datetime
import os

# Import mock database functions for authentication
from app.utils.mock_db import get_user_by_email, get_user_by_id, generate_mock_token, add_user, verify_mock_token

# GraphQL types
@strawberry.enum
class UserRole(str):
    STUDENT = "STUDENT"
    TEACHER = "TEACHER"
    ADMIN = "ADMIN"

@strawberry.type
class User:
    id: str
    username: str
    email: str
    name: Optional[str] = None
    avatar: Optional[str] = None
    role: UserRole
    createdAt: str
    updatedAt: Optional[str] = None

@strawberry.type
class AuthResponse:
    user: Optional[User] = None
    token: str
    refreshToken: Optional[str] = None
    expiresAt: Optional[str] = None

@strawberry.input
class RegisterInput:
    username: str
    email: str
    password: str
    name: Optional[str] = None
    role: Optional[UserRole] = None

# Queries
@strawberry.type
class Query:
    @strawberry.field
    async def me(self, info) -> Optional[User]:
        auth_header = info.context["request"].headers.get("authorization")
        
        if not auth_header:
            return None
        
        try:
            # Extract token from authorization header
            scheme, token = auth_header.split()
            if scheme.lower() != "bearer":
                return None
            
            # Verify token
            user_data = verify_mock_token(token)
            if not user_data:
                return None
            
            return User(
                id=user_data["id"],
                username=user_data["username"],
                email=user_data["email"],
                name=user_data.get("name"),
                avatar=user_data.get("avatar"),
                role=user_data["role"],
                createdAt=user_data["createdAt"],
                updatedAt=user_data.get("updatedAt")
            )
        except Exception:
            return None
    
    @strawberry.field
    async def getUserById(self, id: str) -> Optional[User]:
        user_data = get_user_by_id(id)
        
        if not user_data:
            return None
        
        return User(
            id=user_data["id"],
            username=user_data["username"],
            email=user_data["email"],
            name=user_data.get("name"),
            avatar=user_data.get("avatar"),
            role=user_data["role"],
            createdAt=user_data["createdAt"],
            updatedAt=user_data.get("updatedAt")
        )

# Mutations
@strawberry.type
class Mutation:
    @strawberry.mutation
    async def login(self, email: str, password: str) -> AuthResponse:
        # In a real app, you would hash the password and compare with stored hash
        # For mock purposes, we'll just check if user exists and password is 'password123'
        user_data = get_user_by_email(email)
        
        if not user_data or password != "password123":
            raise Exception("Invalid email or password")
        
        # Generate token
        token_data = generate_mock_token(user_data["id"])
        
        return AuthResponse(
            user=User(
                id=user_data["id"],
                username=user_data["username"],
                email=user_data["email"],
                name=user_data.get("name"),
                avatar=user_data.get("avatar"),
                role=user_data["role"],
                createdAt=user_data["createdAt"],
                updatedAt=user_data.get("updatedAt")
            ),
            token=token_data["token"],
            refreshToken=token_data["refreshToken"],
            expiresAt=token_data["expiresAt"]
        )
    
    @strawberry.mutation
    async def register(self, input: RegisterInput) -> AuthResponse:
        # Create user
        new_user = add_user(
            username=input.username,
            email=input.email,
            password="password123",  # In a real app, this would be hashed
            name=input.name,
            role=input.role or "STUDENT"
        )
        
        if not new_user:
            raise Exception("User already exists")
        
        # Generate token
        token_data = generate_mock_token(new_user["id"])
        
        return AuthResponse(
            user=User(
                id=new_user["id"],
                username=new_user["username"],
                email=new_user["email"],
                name=new_user.get("name"),
                avatar=new_user.get("avatar"),
                role=new_user["role"],
                createdAt=new_user["createdAt"],
                updatedAt=new_user.get("updatedAt")
            ),
            token=token_data["token"],
            refreshToken=token_data["refreshToken"],
            expiresAt=token_data["expiresAt"]
        )
    
    @strawberry.mutation
    async def refreshToken(self, refreshToken: str) -> AuthResponse:
        if not refreshToken or not refreshToken.startswith("mock-refresh-token-"):
            raise Exception("Invalid refresh token")
        
        # Extract user ID from token
        parts = refreshToken.split("-")
        if len(parts) < 4:
            raise Exception("Invalid refresh token format")
        
        user_id = parts[3]
        user_data = get_user_by_id(user_id)
        
        if not user_data:
            raise Exception("User not found")
        
        # Generate new token
        token_data = generate_mock_token(user_data["id"])
        
        return AuthResponse(
            user=User(
                id=user_data["id"],
                username=user_data["username"],
                email=user_data["email"],
                name=user_data.get("name"),
                avatar=user_data.get("avatar"),
                role=user_data["role"],
                createdAt=user_data["createdAt"],
                updatedAt=user_data.get("updatedAt")
            ),
            token=token_data["token"],
            refreshToken=token_data["refreshToken"],
            expiresAt=token_data["expiresAt"]
        )
    
    @strawberry.mutation
    async def logout(self) -> bool:
        # In a real implementation, this would invalidate the token
        return True
    
    @strawberry.mutation
    async def resetPassword(self, email: str) -> bool:
        # In a mock implementation, just check if the user exists
        user = get_user_by_email(email)
        return user is not None
    
    @strawberry.mutation
    async def confirmResetPassword(self, token: str, newPassword: str) -> bool:
        # In a mock implementation, just validate the token format
        if not token or not token.startswith("mock-reset-token-"):
            return False
        
        return True

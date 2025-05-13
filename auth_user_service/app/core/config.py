from pydantic import BaseSettings, Field
from typing import Optional
import os
from functools import lru_cache

class Settings(BaseSettings):
    # Configuración general
    PROJECT_NAME: str = "CourseClash Auth Service"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = Field(default=False)
    
    # Configuración de base de datos
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    
    # Configuración de Auth0
    AUTH0_DOMAIN: str = Field(..., env="AUTH0_DOMAIN")
    AUTH0_API_AUDIENCE: str = Field(..., env="AUTH0_API_AUDIENCE")
    AUTH0_ALGORITHMS: str = Field(default="RS256", env="AUTH0_ALGORITHMS")
    AUTH0_CLIENT_ID: str = Field(..., env="AUTH0_CLIENT_ID")
    AUTH0_CLIENT_SECRET: str = Field(..., env="AUTH0_CLIENT_SECRET")
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()

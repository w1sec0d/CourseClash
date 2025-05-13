from sqlalchemy import Boolean, Column, String, Integer, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from typing import List, Optional

from ..db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    auth0_id = Column(String(255), unique=True, index=True)  # ID de Auth0 (sub)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255))
    nickname = Column(String(100), nullable=True)
    picture = Column(String(255), nullable=True)  # URL de la imagen de perfil
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Datos específicos de la aplicación que no están en Auth0
    rank = Column(String(50), nullable=True)
    points = Column(Integer, default=0)
    level = Column(Integer, default=1)
    
    # Relaciones con otras tablas (ejemplo)
    # achievements = relationship("Achievement", back_populates="user")
    # courses = relationship("UserCourse", back_populates="user")

    def __repr__(self):
        return f"<User {self.email}>"

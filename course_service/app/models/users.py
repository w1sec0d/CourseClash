from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

# Many-to-many relationship table between users and courses
user_course = Table(
    "user_course",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("course_id", Integer, ForeignKey("courses.id"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    courses = relationship("Course", secondary=user_course, back_populates="users")
    activities = relationship("Activity", back_populates="user")

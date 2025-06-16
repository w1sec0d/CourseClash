from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.database import Base

class ActivityType(str, enum.Enum):
    TASK = "task"
    QUIZ = "quiz"
    ANNOUNCEMENT = "announcement"

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_id = Column(Integer, nullable=False, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    activity_type = Column(String(20), nullable=False)
    due_date = Column(DateTime, nullable=True)
    file_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    created_by = Column(Integer, nullable=False)
    
    # Relationships
    submissions = relationship("Submission", back_populates="activity", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="activity", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Activity(id={self.id}, title='{self.title}', type='{self.activity_type}')>"
        
    @property
    def is_past_due(self):
        """Check if the activity is past its due date"""
        if self.due_date is None:
            return False
        return datetime.now() > self.due_date
        
    @property
    def submissions_count(self):
        """Get the count of submissions for this activity"""
        return len(self.submissions)
        
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "course_id": self.course_id,
            "title": self.title,
            "description": self.description,
            "activity_type": self.activity_type.value,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "file_url": self.file_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "created_by": self.created_by,
            "is_past_due": self.is_past_due,
            "submissions_count": self.submissions_count
        } 
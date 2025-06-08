from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

from app.database import Base

class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    activity_id = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    content = Column(Text)
    file_url = Column(String(255))
    additional_files = Column(JSON)  # Store as JSON array
    submitted_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    activity = relationship("Activity", back_populates="submissions")
    grades = relationship("Grade", back_populates="submission", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Submission(id={self.id}, activity_id={self.activity_id}, user_id={self.user_id})>"
        
    @property
    def is_graded(self):
        """Check if the submission has been graded"""
        return len(self.grades) > 0
        
    @property
    def latest_grade(self):
        """Get the most recent grade for this submission"""
        if not self.grades:
            return None
        return sorted(self.grades, key=lambda x: x.graded_at, reverse=True)[0]
        
    @property
    def can_edit(self):
        """Check if the submission can still be edited (before due date and not graded)"""
        if self.is_graded:
            return False
        if self.activity and self.activity.due_date:
            return datetime.now() < self.activity.due_date
        return True
        
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "activity_id": self.activity_id,
            "user_id": self.user_id,
            "content": self.content,
            "file_url": self.file_url,
            "additional_files": self.additional_files,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "is_graded": self.is_graded,
            "can_edit": self.can_edit,
            "latest_grade": self.latest_grade.to_dict() if self.latest_grade else None
        } 
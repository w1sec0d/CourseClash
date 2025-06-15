from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

class Grade(Base):
    __tablename__ = "grades"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    submission_id = Column(Integer, ForeignKey("submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    graded_by = Column(Integer, nullable=False)  # User ID of the grader (teacher)
    score = Column(DECIMAL(5, 2), nullable=False)  # Score out of 100 or custom scale
    feedback = Column(Text)
    graded_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    submission = relationship("Submission", back_populates="grades")
    
    def __repr__(self):
        return f"<Grade(id={self.id}, submission_id={self.submission_id}, score={self.score})>"
        
    @property
    def score_percentage(self):
        """Get score as percentage (assuming max score is 100)"""
        return float(self.score)
        
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "submission_id": self.submission_id,
            "graded_by": self.graded_by,
            "score": float(self.score),
            "feedback": self.feedback,
            "graded_at": self.graded_at.isoformat() if self.graded_at else None,
            "score_percentage": self.score_percentage
        } 
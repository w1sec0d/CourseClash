from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from decimal import Decimal

class GradeBase(BaseModel):
    score: float = Field(..., ge=0, le=100, description="Puntuación (0-100)")
    feedback: Optional[str] = Field(None, description="Retroalimentación del docente")

    @validator('score')
    def validate_score(cls, v):
        if v < 0 or v > 100:
            raise ValueError('La puntuación debe estar entre 0 y 100')
        return round(v, 2)

class GradeCreate(GradeBase):
    """Schema for creating a new grade"""
    submission_id: int = Field(..., gt=0, description="ID de la entrega")

class GradeUpdate(BaseModel):
    """Schema for updating an existing grade"""
    score: Optional[float] = Field(None, ge=0, le=100, description="Puntuación (0-100)")
    feedback: Optional[str] = Field(None, description="Retroalimentación del docente")

    @validator('score')
    def validate_score(cls, v):
        if v is not None and (v < 0 or v > 100):
            raise ValueError('La puntuación debe estar entre 0 y 100')
        return round(v, 2) if v is not None else v

class GradeResponse(GradeBase):
    """Schema for grade response"""
    id: int
    submission_id: int
    graded_by: int
    graded_at: datetime
    score_percentage: float

    class Config:
        from_attributes = True 
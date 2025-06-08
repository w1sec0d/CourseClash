from pydantic import BaseModel, Field, validator
from typing import Optional, List, Any
from datetime import datetime

class SubmissionBase(BaseModel):
    content: Optional[str] = Field(None, description="Contenido de la entrega")
    file_url: Optional[str] = Field(None, max_length=255, description="URL del archivo principal")
    additional_files: Optional[List[str]] = Field(None, description="URLs de archivos adicionales")

    @validator('file_url')
    def validate_file_url(cls, v):
        if v and not v.startswith(('http://', 'https://', '/files/')):
            raise ValueError('La URL del archivo debe ser válida')
        return v

    @validator('additional_files')
    def validate_additional_files(cls, v):
        if v:
            for file_url in v:
                if not file_url.startswith(('http://', 'https://', '/files/')):
                    raise ValueError('Todas las URLs de archivos deben ser válidas')
        return v

class SubmissionCreate(SubmissionBase):
    """Schema for creating a new submission"""
    activity_id: int = Field(..., gt=0, description="ID de la actividad")

class SubmissionUpdate(SubmissionBase):
    """Schema for updating an existing submission"""
    pass

class SubmissionResponse(SubmissionBase):
    """Schema for submission response"""
    id: int
    activity_id: int
    user_id: int
    submitted_at: datetime
    is_graded: bool
    can_edit: bool
    latest_grade: Optional[Any] = None  # Will be GradeResponse when imported

    class Config:
        from_attributes = True

class SubmissionList(BaseModel):
    """Schema for paginated submission list"""
    submissions: List[SubmissionResponse]
    total: int
    page: int
    size: int
    pages: int 
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime, timezone
from enum import Enum

class ActivityType(str, Enum):
    TASK = "task"
    QUIZ = "quiz"
    ANNOUNCEMENT = "announcement"

class ActivityBase(BaseModel):
    course_id: int = Field(..., ge=0, description="ID del curso")
    title: str = Field(..., min_length=1, max_length=100, description="Título de la actividad")
    description: Optional[str] = Field(None, description="Descripción de la actividad")
    activity_type: ActivityType = Field(..., description="Tipo de actividad")
    due_date: Optional[datetime] = Field(None, description="Fecha límite de entrega")
    file_url: Optional[str] = Field(None, max_length=255, description="URL del archivo adjunto")

    @validator('due_date')
    def validate_due_date(cls, v):

        # Convierte de aware a naive 
        if v:
            if v.tzinfo is not None: 
                v = v.astimezone(timezone.utc).replace(tzinfo=None)
        
        if v and v <= datetime.now():
            raise ValueError('La fecha límite debe ser futura')
            
        return v

    @validator('file_url')
    def validate_file_url(cls, v):
        if v and not v.startswith(('http://', 'https://', '/api/v1/files/', '/files/')):
            raise ValueError('La URL del archivo debe ser válida')
        return v

class ActivityCreate(ActivityBase):
    """Schema for creating a new activity"""
    pass

class ActivityUpdate(BaseModel):
    """Schema for updating an existing activity"""
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    activity_type: Optional[ActivityType] = None
    due_date: Optional[datetime] = None
    file_url: Optional[str] = Field(None, max_length=255)

    @validator('due_date')
    def validate_due_date(cls, v):
        if v and v <= datetime.now():
            raise ValueError('La fecha límite debe ser futura')
        return v

    @validator('file_url')
    def validate_file_url(cls, v):
        if v and not v.startswith(('http://', 'https://', '/api/v1/files/', '/files/')):
            raise ValueError('La URL del archivo debe ser válida')
        return v

class ActivityResponse(ActivityBase):
    """Schema for activity response"""
    id: int
    created_at: datetime
    created_by: int

    class Config:
        from_attributes = True

class ActivityList(BaseModel):
    """Schema for paginated activity list"""
    activities: List[ActivityResponse]


# Esquemas de volver una actividad
class CommentSchema(BaseModel):
    id: int
    user_id: int
    content: str
    created_at: datetime
    class Config:
        from_attributes = True

class ActivitySchema(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    activity_type: ActivityType
    due_date: Optional[datetime] = None
    file_url: Optional[str] = None
    created_at: datetime
    created_by: int
    comments: List[CommentSchema] = []
    class Config:
        from_attributes = True
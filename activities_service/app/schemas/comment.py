from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, description="Contenido del comentario")

class CommentCreate(CommentBase):
    """Schema for creating a new comment"""
    #activity_id: int = Field(..., gt=0, description="ID de la actividad")
    pass

class CommentResponse(CommentBase):
    """Schema for comment response"""
    id: int
    activity_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CommentList(BaseModel):
    """Schema for paginated comment list"""
    comments: List[CommentResponse]
    total: int
    page: int
    size: int
    pages: int 
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    user_id: int
    course_id: int
    completed: bool = False
    due_date: Optional[datetime] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    user_id: Optional[int] = None
    course_id: Optional[int] = None
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None

class Activity(ActivityBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
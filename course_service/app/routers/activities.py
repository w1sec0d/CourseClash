from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/activities",
    tags=["activities"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Activity, status_code=status.HTTP_201_CREATED)
def create_activity(activity: schemas.ActivityCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.id == activity.user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if course exists
    db_course = db.query(models.Course).filter(models.Course.id == activity.course_id).first()
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if user is enrolled in the course
    if db_course not in db_user.courses:
        raise HTTPException(status_code=400, detail="User is not enrolled in this course")
    
    db_activity = models.Activity(**activity.dict())
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.get("/", response_model=List[schemas.Activity])
def read_activities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    activities = db.query(models.Activity).offset(skip).limit(limit).all()
    return activities

@router.get("/{activity_id}", response_model=schemas.Activity)
def read_activity(activity_id: int, db: Session = Depends(get_db)):
    db_activity = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    if db_activity is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    return db_activity

@router.put("/{activity_id}", response_model=schemas.Activity)
def update_activity(activity_id: int, activity: schemas.ActivityUpdate, db: Session = Depends(get_db)):
    db_activity = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    if db_activity is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    update_data = activity.dict(exclude_unset=True)
    
    # If user_id is being updated, check if the user exists
    if "user_id" in update_data:
        db_user = db.query(models.User).filter(models.User.id == update_data["user_id"]).first()
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")
    
    # If course_id is being updated, check if the course exists
    if "course_id" in update_data:
        db_course = db.query(models.Course).filter(models.Course.id == update_data["course_id"]).first()
        if db_course is None:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Check if user is enrolled in the new course
        db_user = db.query(models.User).filter(models.User.id == (update_data.get("user_id") or db_activity.user_id)).first()
        if db_course not in db_user.courses:
            raise HTTPException(status_code=400, detail="User is not enrolled in this course")
    
    for key, value in update_data.items():
        setattr(db_activity, key, value)
    
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    db_activity = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    if db_activity is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    db.delete(db_activity)
    db.commit()
    return None

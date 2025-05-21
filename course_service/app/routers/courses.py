from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from .. import models, schemas
from ..db import get_db


router = APIRouter(
    prefix="/courses",
    tags=["courses"],
    responses={404: {"description": "Not found"}},
)

@router.get("/{id}")
def get_courses(id_user: int, db: Session = Depends(get_db)): 
    try:

        query = text("""
            SELECT c.id, c.title, c.description, c.created_at, c.is_active, u.full_name AS creator_name
            FROM courses c
            JOIN course_participants cp ON c.id = cp.course_id
            JOIN users u ON c.creator_id = u.id
            WHERE cp.user_id = :user_id
        """)

        data = db.execute(query, {'user_id': id_user}).mappings().all()

        if not data:
            raise HTTPException(
                status_code = status.HTTP_404_NOT_FOUND,
                detail = "No se encontraron cursos del usuario"
            )
        
        data_courses = [course for course in data]
        return data_courses
    except HTTPException as e:
        raise e
    except Exception as e: 
        raise HTTPException(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail = f'Error en el servidor {e}'
        )
# @router.post("/", response_model=schemas.Course, status_code=status.HTTP_201_CREATED)
# def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
#     db_course = models.Course(
#         title=course.title,
#         description=course.description
#     )
#     db.add(db_course)
#     db.commit()
#     db.refresh(db_course)
#     return db_course

# @router.get("/", response_model=List[schemas.Course])
# def read_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     courses = db.query(models.Course).offset(skip).limit(limit).all()
#     return courses

# @router.get("/{course_id}", response_model=schemas.CourseWithUsers)
# def read_course(course_id: int, db: Session = Depends(get_db)):
#     db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
#     if db_course is None:
#         raise HTTPException(status_code=404, detail="Course not found")
#     return db_course

# @router.put("/{course_id}", response_model=schemas.Course)
# def update_course(course_id: int, course: schemas.CourseUpdate, db: Session = Depends(get_db)):
#     db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
#     if db_course is None:
#         raise HTTPException(status_code=404, detail="Course not found")
    
#     update_data = course.dict(exclude_unset=True)
#     for key, value in update_data.items():
#         setattr(db_course, key, value)
    
#     db.commit()
#     db.refresh(db_course)
#     return db_course

# @router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_course(course_id: int, db: Session = Depends(get_db)):
#     db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
#     if db_course is None:
#         raise HTTPException(status_code=404, detail="Course not found")
    
#     db.delete(db_course)
#     db.commit()
#     return None

# @router.get("/{course_id}/users", response_model=List[schemas.User])
# def read_course_users(course_id: int, db: Session = Depends(get_db)):
#     db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
#     if db_course is None:
#         raise HTTPException(status_code=404, detail="Course not found")
    
#     return db_course.users
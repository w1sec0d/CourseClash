from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional
from datetime import datetime
import logging

from app.models.grade import Grade
from app.models.submission import Submission
from app.models.activity import Activity
from app.schemas.grade import GradeCreate, GradeUpdate, GradeResponse

logger = logging.getLogger(__name__)

class GradeService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_grade(self, grade_data: GradeCreate, graded_by: int, submission_id: int) -> Grade:
        """
        Crear una nueva calificación para una entrega
        """
        try:
            # Verificar que la entrega existe
            submission = self.db.query(Submission).filter(
                Submission.id == submission_id
            ).first()
            
            if not submission:
                raise ValueError("La entrega no existe")
            
            # Obtener la actividad asociada a la entrega
            activity = submission.activity

            # Comentado para permitir calificación en cualquier momento durante las pruebas
            # if activity.due_date and datetime.now() < activity.due_date:
            #     raise ValueError("No se puede calificar antes de la fecha límite de la actividad")
            
            # Verificar que no existe ya una calificación
            existing_grade = self.db.query(Grade).filter(
                Grade.submission_id == submission_id
            ).first()
            
            if existing_grade:
                raise ValueError("Esta entrega ya ha sido calificada. Use la función de actualización.")
            
            
            # Verificar permisos: cualquier profesor puede calificar
            # Esta verificación se hace a nivel de router con el parámetro user_role
            # Por ahora permitimos que cualquier profesor califique
            
            # Crear la calificación
            db_grade = Grade(
                submission_id=submission_id,
                graded_by=graded_by,
                score=grade_data.score,
                feedback=grade_data.feedback
            )
            
            self.db.add(db_grade)
            self.db.commit()
            self.db.refresh(db_grade)
            
            logger.info(f"Calificación creada: {db_grade.id} para entrega {submission_id}")
            return db_grade
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creando calificación: {e}")
            raise
    
    def get_grade_by_submission(
        self,
        submission_id: int,
        current_user_id: int,
        current_user_role: str = "student"
    ) -> Optional[Grade]:
        """
        Obtener la calificación de una entrega específica
        """
        try:
            query = self.db.query(Grade).filter(Grade.submission_id == submission_id)
            
            # Aplicar filtros de seguridad
            if current_user_role == "student":
                # Los estudiantes solo pueden ver calificaciones de sus propias entregas
                query = query.join(Submission).filter(Submission.user_id == int(current_user_id))
            elif current_user_role == "teacher":
                # Los profesores pueden ver todas las calificaciones (sin restricción de creador)
                pass  # No aplicamos filtro adicional para profesores
            
            return query.first()
            
        except Exception as e:
            logger.error(f"Error obteniendo calificación de entrega {submission_id}: {e}")
            raise
    
    def update_grade_by_submission(
        self,
        submission_id: int,
        grade_data: GradeCreate,
        current_user_id: int
    ) -> Optional[Grade]:
        """
        Actualizar la calificación de una entrega
        """
        try:
            # Obtener la calificación existente (sin restricción de creador de actividad)
            grade = self.db.query(Grade).filter(
                Grade.submission_id == submission_id
            ).first()
            
            if not grade:
                return None
            
            # Actualizar campos
            grade.score = grade_data.score
            grade.feedback = grade_data.feedback
            grade.graded_at = datetime.now()
            
            self.db.commit()
            self.db.refresh(grade)
            
            logger.info(f"Calificación {grade.id} actualizada")
            return grade
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error actualizando calificación de entrega {submission_id}: {e}")
            raise
    
    def get_grade_by_id(self, grade_id: int) -> Optional[Grade]:
        """
        Obtener una calificación por ID
        """
        try:
            return self.db.query(Grade).filter(Grade.id == grade_id).first()
            
        except Exception as e:
            logger.error(f"Error obteniendo calificación {grade_id}: {e}")
            raise
    
    def delete_grade(self, grade_id: int, current_user_id: int) -> bool:
        """
        Eliminar una calificación
        Solo el profesor que la creó puede eliminarla
        """
        try:
            grade = self.db.query(Grade).join(Submission).join(Activity).filter(
                and_(
                    Grade.id == grade_id,
                    Activity.created_by == int(current_user_id)
                )
            ).first()
            
            if not grade:
                return False
            
            self.db.delete(grade)
            self.db.commit()
            
            logger.info(f"Calificación {grade_id} eliminada")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error eliminando calificación {grade_id}: {e}")
            raise
    
    def get_grades_by_activity(self, activity_id: int) -> list[Grade]:
        """
        Obtener todas las calificaciones de una actividad específica
        """
        try:
            return self.db.query(Grade).join(Submission).filter(
                Submission.activity_id == activity_id
            ).order_by(Grade.graded_at.desc()).all()
            
        except Exception as e:
            logger.error(f"Error obteniendo calificaciones de la actividad {activity_id}: {e}")
            raise
    
    def get_grades_by_teacher(self, teacher_id: int) -> list[Grade]:
        """
        Obtener todas las calificaciones realizadas por un profesor
        """
        try:
            return self.db.query(Grade).filter(
                Grade.graded_by == teacher_id
            ).order_by(Grade.graded_at.desc()).all()
            
        except Exception as e:
            logger.error(f"Error obteniendo calificaciones del profesor {teacher_id}: {e}")
            raise
    
    def get_student_grades(self, student_id: int) -> list[Grade]:
        """
        Obtener todas las calificaciones de un estudiante
        """
        try:
            return self.db.query(Grade).join(Submission).filter(
                Submission.user_id == student_id
            ).order_by(Grade.graded_at.desc()).all()
            
        except Exception as e:
            logger.error(f"Error obteniendo calificaciones del estudiante {student_id}: {e}")
            raise
    
    def calculate_activity_average(self, activity_id: int) -> Optional[float]:
        """
        Calcular el promedio de calificaciones de una actividad
        """
        try:
            grades = self.get_grades_by_activity(activity_id)
            
            if not grades:
                return None
            
            total_score = sum(float(grade.score) for grade in grades)
            return total_score / len(grades)
            
        except Exception as e:
            logger.error(f"Error calculando promedio de actividad {activity_id}: {e}")
            raise
    
    def calculate_student_average(self, student_id: int) -> Optional[float]:
        """
        Calcular el promedio de calificaciones de un estudiante
        """
        try:
            grades = self.get_student_grades(student_id)
            
            if not grades:
                return None
            
            total_score = sum(float(grade.score) for grade in grades)
            return total_score / len(grades)
            
        except Exception as e:
            logger.error(f"Error calculando promedio del estudiante {student_id}: {e}")
            raise 
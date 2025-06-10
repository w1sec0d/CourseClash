from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import Optional, List
from datetime import datetime
import logging
import math

from app.models.submission import Submission
from app.models.activity import Activity
from app.schemas.submission import SubmissionCreate, SubmissionUpdate, SubmissionList, SubmissionResponse

logger = logging.getLogger(__name__)

class SubmissionService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_submission(self, submission_data: SubmissionCreate, user_id: int) -> Submission:
        """
        Crear una nueva entrega para una actividad
        """
        try:
            # Verificar que la actividad existe
            activity = self.db.query(Activity).filter(Activity.id == submission_data.activity_id).first()
            if not activity:
                raise ValueError("La actividad no existe")
            
            # Verificar que no haya pasado la fecha límite
            if activity.due_date and datetime.now() > activity.due_date:
                raise ValueError("La fecha límite para esta actividad ha pasado")
            
            # Verificar si ya existe una entrega del usuario para esta actividad
            existing_submission = self.db.query(Submission).filter(
                and_(
                    Submission.activity_id == submission_data.activity_id,
                    Submission.user_id == user_id
                )
            ).first()
            
            if existing_submission:
                raise ValueError("Ya existe una entrega para esta actividad. Use la función de actualización.")
            
            # Crear la entrega
            db_submission = Submission(
                activity_id=submission_data.activity_id,
                user_id=user_id,
                content=submission_data.content,
                file_url=submission_data.file_url,
                additional_files=submission_data.additional_files
            )
            
            self.db.add(db_submission)
            self.db.commit()
            self.db.refresh(db_submission)
            
            logger.info(f"Entrega creada: {db_submission.id} para actividad {submission_data.activity_id}")
            return db_submission
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creando entrega 1: {e}")
            raise
    
    def get_submissions(
        self,
        activity_id: Optional[int] = None,
        user_id: Optional[int] = None,
        page: int = 1,
        size: int = 10,
        current_user_id: int = None,
        current_user_role: str = "student"
    ) -> SubmissionList:
        """
        Obtener lista paginada de entregas con filtros
        """
        try:
            query = self.db.query(Submission)
            
            # Aplicar filtros de seguridad según el rol
            if current_user_role == "student":
                # Los estudiantes solo pueden ver sus propias entregas
                query = query.filter(Submission.user_id == current_user_id)
            elif current_user_role == "teacher":
                # Los profesores pueden ver entregas de actividades que crearon
                query = query.join(Activity).filter(Activity.created_by == current_user_id)
            # Los administradores pueden ver todas las entregas
            
            # Aplicar filtros adicionales
            if activity_id:
                query = query.filter(Submission.activity_id == activity_id)
            
            if user_id and current_user_role in ["teacher", "admin"]:
                query = query.filter(Submission.user_id == user_id)
            
            # Ordenar por fecha de entrega (más recientes primero)
            query = query.order_by(Submission.submitted_at.desc())
            
            # Contar total de registros
            total = query.count()
            
            # Aplicar paginación
            offset = (page - 1) * size
            submissions = query.offset(offset).limit(size).all()
            
            # Calcular número de páginas
            pages = math.ceil(total / size) if total > 0 else 0
            
            # Convertir a esquemas de respuesta
            submission_responses = [SubmissionResponse.from_orm(submission) for submission in submissions]
            
            return SubmissionList(
                submissions=submission_responses,
                total=total,
                page=page,
                size=size,
                pages=pages
            )
            
        except Exception as e:
            logger.error(f"Error obteniendo entregas: {e}")
            raise
    
    def get_submission_by_id(
        self,
        submission_id: int,
        current_user_id: int,
        current_user_role: str = "student"
    ) -> Optional[Submission]:
        """
        Obtener una entrega por ID
        """
        try:
            query = self.db.query(Submission).filter(Submission.id == submission_id)
            
            # Aplicar filtros de seguridad
            if current_user_role == "student":
                query = query.filter(Submission.user_id == current_user_id)
            elif current_user_role == "teacher":
                # Los profesores pueden ver entregas de actividades que crearon
                query = query.join(Activity).filter(Activity.created_by == current_user_id)
            
            return query.first()
            
        except Exception as e:
            logger.error(f"Error obteniendo entrega {submission_id}: {e}")
            raise
    
    def update_submission(
        self,
        submission_id: int,
        submission_data: SubmissionUpdate,
        current_user_id: int
    ) -> Optional[Submission]:
        """
        Actualizar una entrega existente
        Solo el estudiante que la creó puede actualizarla y antes de la fecha límite
        """
        try:
            submission = self.db.query(Submission).filter(
                and_(
                    Submission.id == submission_id,
                    Submission.user_id == current_user_id
                )
            ).first()
            
            if not submission:
                return None
            
            # Verificar que se puede editar (antes de la fecha límite y no calificada)
            if not submission.can_edit:
                raise ValueError("No se puede editar esta entrega")
            
            # Actualizar campos proporcionados
            update_data = submission_data.dict(exclude_unset=True)
            
            for field, value in update_data.items():
                if hasattr(submission, field):
                    setattr(submission, field, value)
            
            # Actualizar timestamp de entrega
            submission.submitted_at = datetime.now()
            
            self.db.commit()
            self.db.refresh(submission)
            
            logger.info(f"Entrega {submission_id} actualizada")
            return submission
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error actualizando entrega {submission_id}: {e}")
            raise
    
    def delete_submission(
        self,
        submission_id: int,
        current_user_id: int
    ) -> bool:
        """
        Eliminar una entrega
        Solo el estudiante que la creó puede eliminarla y antes de la fecha límite
        """
        try:
            submission = self.db.query(Submission).filter(
                and_(
                    Submission.id == submission_id,
                    Submission.user_id == current_user_id
                )
            ).first()
            
            if not submission:
                return False
            
            # Verificar que se puede eliminar
            if not submission.can_edit:
                raise ValueError("No se puede eliminar esta entrega")
            
            self.db.delete(submission)
            self.db.commit()
            
            logger.info(f"Entrega {submission_id} eliminada")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error eliminando entrega {submission_id}: {e}")
            raise
    
    def get_submissions_by_activity(self, activity_id: int) -> List[Submission]:
        """
        Obtener todas las entregas de una actividad específica
        """
        try:
            return self.db.query(Submission).filter(
                Submission.activity_id == activity_id
            ).order_by(Submission.submitted_at.desc()).all()
            
        except Exception as e:
            logger.error(f"Error obteniendo entregas de la actividad {activity_id}: {e}")
            raise
    
    def get_submissions_by_user(self, user_id: int) -> List[Submission]:
        """
        Obtener todas las entregas de un usuario específico
        """
        try:
            return self.db.query(Submission).filter(
                Submission.user_id == user_id
            ).order_by(Submission.submitted_at.desc()).all()
            
        except Exception as e:
            logger.error(f"Error obteniendo entregas del usuario {user_id}: {e}")
            raise
    
    def get_user_submission_for_activity(self, user_id: int, activity_id: int) -> Optional[Submission]:
        """
        Obtener la entrega de un usuario específico para una actividad específica
        """
        try:
            return self.db.query(Submission).filter(
                and_(
                    Submission.user_id == user_id,
                    Submission.activity_id == activity_id
                )
            ).first()
            
        except Exception as e:
            logger.error(f"Error obteniendo entrega del usuario {user_id} para actividad {activity_id}: {e}")
            raise 
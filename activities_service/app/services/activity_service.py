from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_
from typing import Optional, List
from datetime import datetime
import logging

from app.models.activity import Activity, ActivityType
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityList, ActivityResponse, ActivitySchema, CommentSchema
import math

logger = logging.getLogger(__name__)

class ActivityService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_activity(self, activity_data: ActivityCreate, created_by: int) -> Activity:
        """
        Crear una nueva actividad
        """
        try:
            # Validar que la fecha límite sea futura si se proporciona
            if activity_data.due_date and activity_data.due_date <= datetime.now():
                raise ValueError("La fecha límite debe ser futura")
            
            # Crear la actividad
            db_activity = Activity(
                course_id=activity_data.course_id,
                title=activity_data.title,
                description=activity_data.description,
                activity_type=activity_data.activity_type,
                due_date=activity_data.due_date,
                file_url=activity_data.file_url,
                created_by=created_by
            )
            
            self.db.add(db_activity)
            self.db.commit()
            self.db.refresh(db_activity)
            
            logger.info(f"Actividad creada: {db_activity.id}")
            return db_activity
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creando actividad: {e}")
            raise
    
    def get_activities(
        self, 
        course_id: Optional[int] = None,
        activity_type: Optional[str] = None,
        page: int = 1,
        size: int = 10,
        user_id: Optional[int] = None,
        user_role: str = "student"
    ) -> ActivityList:
        """
        Obtener lista paginada de actividades con filtros
        """
        try:
            query = self.db.query(Activity)
            
            # Aplicar filtros
            if course_id:
                query = query.filter(Activity.course_id == course_id)
            
            if activity_type:
                try:
                    activity_type_enum = ActivityType(activity_type)
                    query = query.filter(Activity.activity_type == activity_type_enum)
                except ValueError:
                    # Tipo de actividad inválido, devolver lista vacía
                    return ActivityList(
                        activities=[],
                        total=0,
                        page=page,
                        size=size,
                        pages=0
                    )
            
            # Los estudiantes solo ven actividades no vencidas o sus propias entregas
            if user_role == "student":
                # Aquí podrías agregar lógica adicional para filtrar por curso del estudiante
                pass
            
            # Ordenar por fecha de creación (más recientes primero)
            query = query.order_by(Activity.created_at.desc())
            
            # Contar total de registros
            total = query.count()
            
            # Aplicar paginación
            offset = (page - 1) * size
            activities = query.offset(offset).limit(size).all()
            
            # Calcular número de páginas
            pages = math.ceil(total / size) if total > 0 else 0
            
            # Convertir a esquemas de respuesta
            activity_responses = [ActivityResponse.from_orm(activity) for activity in activities]
            
            return ActivityList(
                activities=activity_responses,
                total=total,
                page=page,
                size=size,
                pages=pages
            )
            
        except Exception as e:
            logger.error(f"Error obteniendo actividades: {e}")
            raise
    
    # Obtiene una actividad por su id
    def get_activity_by_id(
        self, 
        activity_id: int, 
        user_id: Optional[int] = None
    ) -> Optional[ActivitySchema]:
        """
        Obtener una actividad por ID
        """
        try:
            #activity = self.db.query(Activity).filter(Activity.id == activity_id).first()
            activity_query = (
                self.db.query(Activity)
                .options(joinedload(Activity.comments))  # Carga los comentarios en la misma consulta
                .filter(Activity.id == activity_id)
                .first()
            )
            
            if not activity_query:
                return None
            
            activity = ActivitySchema(
                id=activity_query.id,
                course_id=activity_query.course_id,
                title=activity_query.title,
                description=activity_query.description,
                activity_type=activity_query.activity_type,
                due_date=activity_query.due_date,
                file_url=activity_query.file_url,
                created_at=activity_query.created_at,
                created_by=activity_query.created_by,
                comments=[
                    CommentSchema(
                        id=c.id,
                        user_id=c.user_id,
                        content=c.content,
                        created_at=c.created_at
                    )
                    for c in activity_query.comments
                ]
            )

            
            return activity
        except Exception as e:
            logger.error(f"Error obteniendo actividad {activity_id}: {e}")
            raise
    
    def update_activity(
        self, 
        activity_id: int, 
        activity_data: ActivityUpdate,
        user_id: int,
        user_role: str = "teacher"
    ) -> Optional[Activity]:
        """
        Actualizar una actividad existente
        """
        try:
            activity = self.db.query(Activity).filter(Activity.id == activity_id).first()
            
            if not activity:
                logger.error(f"Actividad {activity_id} no encontrada")
                return None
            
            # Verificar permisos
            logger.info(f"Verificando permisos: user_role={user_role}, user_id={user_id} (type: {type(user_id)}), created_by={activity.created_by} (type: {type(activity.created_by)})")
            if user_role != "admin" and activity.created_by != int(user_id):
                logger.error(f"Sin permisos: user_role={user_role}, user_id={user_id}, created_by={activity.created_by}")
                return None
            
            # Actualizar campos proporcionados
            update_data = activity_data.dict(exclude_unset=True)
            
            for field, value in update_data.items():
                if hasattr(activity, field):
                    setattr(activity, field, value)
            
            self.db.commit()
            self.db.refresh(activity)
            
            logger.info(f"Actividad {activity_id} actualizada")
            return activity
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error actualizando actividad {activity_id}: {e}")
            raise
    
    def delete_activity(
        self, 
        activity_id: int,
        user_id: int,
        user_role: str = "teacher"
    ) -> bool:
        """
        Eliminar una actividad
        """
        try:
            activity = self.db.query(Activity).filter(Activity.id == activity_id).first()
            
            if not activity:
                return False
            
            # Verificar permisos
            if user_role != "admin" and activity.created_by != user_id:
                return False
            
            # Verificar si hay entregas asociadas
            if activity.submissions:
                # Podrías decidir si permitir eliminación con entregas o no
                logger.warning(f"Intentando eliminar actividad {activity_id} con entregas existentes")
                # Por seguridad, no permitir eliminación si hay entregas
                raise ValueError("No se puede eliminar una actividad con entregas existentes")
            
            self.db.delete(activity)
            self.db.commit()
            
            logger.info(f"Actividad {activity_id} eliminada")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error eliminando actividad {activity_id}: {e}")
            raise
    
    def get_activities_by_course(self, course_id: int) -> List[Activity]:
        """
        Obtener todas las actividades de un curso específico
        """
        try:
            return self.db.query(Activity).filter(
                Activity.course_id == course_id
            ).order_by(Activity.created_at.desc()).all()
            
        except Exception as e:
            logger.error(f"Error obteniendo actividades del curso {course_id}: {e}")
            raise
    
    def get_activities_by_teacher(self, teacher_id: int) -> List[Activity]:
        """
        Obtener todas las actividades creadas por un profesor
        """
        try:
            return self.db.query(Activity).filter(
                Activity.created_by == teacher_id
            ).order_by(Activity.created_at.desc()).all()
            
        except Exception as e:
            logger.error(f"Error obteniendo actividades del profesor {teacher_id}: {e}")
            raise 
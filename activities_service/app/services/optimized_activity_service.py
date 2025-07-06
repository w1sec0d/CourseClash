from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_
from typing import Optional, List
from datetime import datetime
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor

from app.models.activity import Activity, ActivityType
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityList, ActivityResponse, ActivitySchema, CommentSchema
from app.services.cache_service import CacheService
from app.database.config import get_master_session, get_read_session, db_router

logger = logging.getLogger(__name__)

class OptimizedActivityService:
    """
    Servicio optimizado de actividades que implementa el patrón:
    Read Replica + Multi-Level Intelligent Caching
    
    Tácticas implementadas:
    1. Introducir Concurrencia: Separación READ/WRITE + Connection Pooling
    2. Mantener Múltiples Copias: Read Replicas + Cache L2
    3. Reducir Overhead: Eager Loading + Query Optimization
    4. Invalidación Inteligente: Event-driven cache invalidation
    """
    
    def __init__(self, cache_service: CacheService = None):
        self.cache = cache_service or CacheService()
        self.executor = ThreadPoolExecutor(max_workers=10)  # Para operaciones concurrentes
    
    # ========================================================================
    # WRITE OPERATIONS (Master Database)
    # ========================================================================
    
    def create_activity(self, activity_data: ActivityCreate, created_by: int) -> Activity:
        """
        Crear una nueva actividad - WRITE operation
        """
        try:
            # Validar que la fecha límite sea futura si se proporciona
            if activity_data.due_date and activity_data.due_date <= datetime.now():
                raise ValueError("La fecha límite debe ser futura")
            
            # Usar master database para escritura
            with get_master_session() as session:
                db_activity = Activity(
                    course_id=activity_data.course_id,
                    title=activity_data.title,
                    description=activity_data.description,
                    activity_type=activity_data.activity_type,
                    due_date=activity_data.due_date,
                    file_url=activity_data.file_url,
                    created_by=created_by
                )
                
                session.add(db_activity)
                session.commit()
                session.refresh(db_activity)
                
                # Invalidar cache relacionado
                self.cache.invalidate_course_cache(activity_data.course_id)
                
                logger.info(f"✅ Actividad creada: {db_activity.id}")
                return db_activity
                
        except Exception as e:
            logger.error(f"❌ Error creando actividad: {e}")
            raise
    
    def update_activity(
        self, 
        activity_id: int, 
        activity_data: ActivityUpdate,
        user_id: int,
        user_role: str = "teacher"
    ) -> Optional[Activity]:
        """
        Actualizar una actividad existente - WRITE operation
        """
        try:
            with get_master_session() as session:
                activity = session.query(Activity).filter(Activity.id == activity_id).first()
                
                if not activity:
                    logger.error(f"Actividad {activity_id} no encontrada")
                    return None
                
                # Verificar permisos
                if user_role != "admin" and activity.created_by != int(user_id):
                    logger.error(f"Sin permisos: user_role={user_role}, user_id={user_id}, created_by={activity.created_by}")
                    return None
                
                # Actualizar campos proporcionados
                update_data = activity_data.dict(exclude_unset=True)
                
                for field, value in update_data.items():
                    if hasattr(activity, field):
                        setattr(activity, field, value)
                
                session.commit()
                session.refresh(activity)
                
                # Invalidar cache relacionado
                self.cache.invalidate_activity_cache(activity_id, activity.course_id)
                
                logger.info(f"✅ Actividad {activity_id} actualizada")
                return activity
                
        except Exception as e:
            logger.error(f"❌ Error actualizando actividad {activity_id}: {e}")
            raise
    
    def delete_activity(
        self, 
        activity_id: int,
        user_id: int,
        user_role: str = "teacher"
    ) -> bool:
        """
        Eliminar una actividad - WRITE operation
        """
        try:
            with get_master_session() as session:
                activity = session.query(Activity).filter(Activity.id == activity_id).first()
                
                if not activity:
                    return False
                
                # Verificar permisos
                if user_role != "admin" and activity.created_by != user_id:
                    return False
                
                # Verificar si hay entregas asociadas
                if activity.submissions:
                    logger.warning(f"Intentando eliminar actividad {activity_id} con entregas existentes")
                    raise ValueError("No se puede eliminar una actividad con entregas existentes")
                
                course_id = activity.course_id
                session.delete(activity)
                session.commit()
                
                # Invalidar cache relacionado
                self.cache.invalidate_activity_cache(activity_id, course_id)
                
                logger.info(f"✅ Actividad {activity_id} eliminada")
                return True
                
        except Exception as e:
            logger.error(f"❌ Error eliminando actividad {activity_id}: {e}")
            raise
    
    # ========================================================================
    # READ OPERATIONS (Read Replica + Cache)
    # ========================================================================
    
    def get_activities(self, course_id: int) -> ActivityList:
        """
        Obtener lista de actividades con cache inteligente - READ operation
        """
        try:
            # 1. Intentar obtener desde cache
            cached_activities = self.cache.get_cached_course_activities(course_id)
            if cached_activities:
                logger.info(f"🎯 Cache HIT: course_activities:{course_id}")
                return ActivityList(activities=cached_activities)
            
            # 2. Cache miss - consultar read replica
            with get_read_session() as session:
                activities = session.query(Activity).filter(Activity.course_id == course_id).all()
                
                # Convertir a esquemas de respuesta
                activity_responses = [ActivityResponse.from_orm(activity) for activity in activities]
                
                # 3. Guardar en cache
                self.cache.cache_course_activities(course_id, activity_responses, ttl=300)
                
                logger.info(f"💾 Cache MISS: course_activities:{course_id} - stored in cache")
                return ActivityList(activities=activity_responses)
                
        except Exception as e:
            logger.error(f"❌ Error obteniendo actividades: {e}")
            # Fallback a master si read replica falla
            with get_master_session() as session:
                activities = session.query(Activity).filter(Activity.course_id == course_id).all()
                activity_responses = [ActivityResponse.from_orm(activity) for activity in activities]
                return ActivityList(activities=activity_responses)
    
    def get_activity_by_id(
        self, 
        activity_id: int, 
        user_id: Optional[int] = None
    ) -> Optional[ActivitySchema]:
        """
        Obtener una actividad por ID con cache y eager loading - READ operation
        """
        try:
            # 1. Intentar obtener desde cache
            cached_activity = self.cache.get_cached_activity(activity_id)
            if cached_activity:
                logger.info(f"🎯 Cache HIT: activity:{activity_id}")
                return cached_activity
            
            # 2. Cache miss - consultar read replica con eager loading
            with get_read_session() as session:
                activity_query = (
                    session.query(Activity)
                    .options(joinedload(Activity.comments))  # Eager loading
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
                
                # 3. Guardar en cache
                self.cache.cache_activity(activity_id, activity, ttl=600)
                
                logger.info(f"💾 Cache MISS: activity:{activity_id} - stored in cache")
                return activity
                
        except Exception as e:
            logger.error(f"❌ Error obteniendo actividad {activity_id}: {e}")
            # Fallback a master si read replica falla
            with get_master_session() as session:
                activity_query = (
                    session.query(Activity)
                    .options(joinedload(Activity.comments))
                    .filter(Activity.id == activity_id)
                    .first()
                )
                
                if not activity_query:
                    return None
                
                return ActivitySchema(
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
    
    def get_activities_by_course(self, course_id: int) -> List[Activity]:
        """
        Obtener actividades por curso - READ operation optimizada
        """
        try:
            # Usar read replica para consultas
            with get_read_session() as session:
                return session.query(Activity).filter(Activity.course_id == course_id).all()
                
        except Exception as e:
            logger.error(f"❌ Error obteniendo actividades por curso {course_id}: {e}")
            # Fallback a master
            with get_master_session() as session:
                return session.query(Activity).filter(Activity.course_id == course_id).all()
    
    def get_activities_by_teacher(self, teacher_id: int) -> List[Activity]:
        """
        Obtener actividades por profesor - READ operation optimizada
        """
        try:
            # Usar read replica para consultas
            with get_read_session() as session:
                return session.query(Activity).filter(Activity.created_by == teacher_id).all()
                
        except Exception as e:
            logger.error(f"❌ Error obteniendo actividades por profesor {teacher_id}: {e}")
            # Fallback a master
            with get_master_session() as session:
                return session.query(Activity).filter(Activity.created_by == teacher_id).all()
    
    # ========================================================================
    # OPERACIONES CONCURRENTES AVANZADAS
    # ========================================================================
    
    async def get_multiple_activities_concurrent(self, activity_ids: List[int]) -> List[Optional[ActivitySchema]]:
        """
        Obtener múltiples actividades de forma concurrente
        """
        loop = asyncio.get_event_loop()
        
        # Crear tasks para ejecución concurrente
        tasks = []
        for activity_id in activity_ids:
            task = loop.run_in_executor(
                self.executor,
                self.get_activity_by_id,
                activity_id
            )
            tasks.append(task)
        
        # Ejecutar todas las tareas concurrentemente
        results = await asyncio.gather(*tasks)
        
        logger.info(f"📊 Obtenidas {len(results)} actividades concurrentemente")
        return results
    
    def preload_course_activities_cache(self, course_id: int) -> bool:
        """
        Precargar cache de actividades de un curso
        """
        try:
            # Obtener actividades y forzar cache
            self.get_activities(course_id)
            logger.info(f"🚀 Precargado cache para curso {course_id}")
            return True
        except Exception as e:
            logger.error(f"❌ Error precargando cache para curso {course_id}: {e}")
            return False
    
    # ========================================================================
    # MÉTRICAS Y MONITOREO
    # ========================================================================
    
    def get_performance_metrics(self) -> dict:
        """
        Obtener métricas de rendimiento del servicio
        """
        from app.database.config import get_database_stats
        
        cache_stats = self.cache.get_cache_stats()
        db_stats = get_database_stats()
        
        return {
            "cache_performance": cache_stats,
            "database_pools": db_stats,
            "service_info": {
                "executor_threads": self.executor._max_workers,
                "pattern": "Read Replica + Multi-Level Intelligent Caching"
            }
        }
    
    def health_check(self) -> dict:
        """
        Verificar salud del servicio
        """
        from app.database.config import check_database_health
        
        db_health = check_database_health()
        
        # Verificar cache
        cache_healthy = self.cache.redis_client is not None
        if cache_healthy:
            try:
                self.cache.redis_client.ping()
            except:
                cache_healthy = False
        
        return {
            "database": db_health,
            "cache": {"healthy": cache_healthy},
            "overall_healthy": db_health["master"] and cache_healthy
        }
    
    def __del__(self):
        """Cleanup resources"""
        if hasattr(self, 'executor'):
            self.executor.shutdown(wait=False) 
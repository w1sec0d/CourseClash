from fastapi import APIRouter, Depends, HTTPException, Request, status, Query, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
import asyncio
from datetime import datetime

from app.database import get_db
from app.models import Activity
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse, ActivityList, ActivitySchema
from app.schemas.comment import CommentCreate, CommentResponse
from app.middleware.auth import get_current_user, require_teacher_or_admin
from app.services.optimized_activity_service import OptimizedActivityService
from app.services.comment_service import CommentService
from app.services.cache_service import CacheService

logger = logging.getLogger(__name__)

router = APIRouter()

# Global optimized service instance
optimized_service = OptimizedActivityService()

# ============================================================================
# ENDPOINTS OPTIMIZADOS CON CACHE Y READ REPLICAS
# ============================================================================

@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity_optimized(
    activity_data: ActivityCreate,
    user_id: int = Header(..., alias="User_id"),
):
    """
    Crear una nueva actividad - OPTIMIZADO
    
    Características:
    - Usa master database para escritura
    - Invalidación automática de cache
    - Logging detallado para monitoreo
    """
    try:
        # Crear la actividad usando el servicio optimizado
        activity = optimized_service.create_activity(activity_data, user_id)
        
        logger.info(f"✅ Actividad creada optimizada: {activity.id} por usuario {user_id}")
        
        return ActivityResponse.from_orm(activity)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error creando actividad optimizada: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/list/{course_id}", response_model=ActivityList)
async def get_activities_optimized(
    course_id: int,
    preload_cache: bool = Query(False, description="Precargar cache para curso")
):
    """
    Obtener lista de actividades - OPTIMIZADO
    
    Características:
    - Cache L2 inteligente con TTL de 5 minutos
    - Fallback automático a master si read replica falla
    - Opción de precarga de cache
    """
    try:
        # Opción de precarga de cache
        if preload_cache:
            optimized_service.preload_course_activities_cache(course_id)
        
        # Obtener actividades usando cache y read replica
        result = optimized_service.get_activities(course_id)
        
        logger.info(f"📊 Actividades obtenidas para curso {course_id}: {len(result.activities)} items")
        
        return result
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo actividades optimizadas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/{activity_id}", response_model=ActivitySchema)
async def get_activity_optimized(
    activity_id: int,
    user_id: Optional[int] = Header(None, alias="User_id")
):
    """
    Obtener una actividad específica - OPTIMIZADO
    
    Características:
    - Cache L2 con TTL de 10 minutos
    - Eager loading de comentarios
    - Fallback automático a master
    """
    try:
        # Obtener actividad usando cache y read replica
        activity = optimized_service.get_activity_by_id(activity_id, user_id)

        if not activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Actividad no encontrada"
            )
        
        logger.info(f"📊 Actividad obtenida: {activity_id}")
        
        return activity
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error obteniendo actividad optimizada {activity_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity_optimized(
    activity_id: int,
    activity_data: ActivityUpdate,
    request: Request,
):
    """
    Actualizar una actividad - OPTIMIZADO
    
    Características:
    - Usa master database para escritura
    - Invalidación automática de cache relacionado
    - Verificación de permisos
    """
    try:
        # Verificar permisos
        require_teacher_or_admin(request)
        
        current_user = get_current_user(request)
        
        # Actualizar usando el servicio optimizado
        activity = optimized_service.update_activity(
            activity_id,
            activity_data,
            user_id=current_user["user_id"],
            user_role=current_user["role"]
        )
        
        if not activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Actividad no encontrada o sin permisos para modificar"
            )
        
        logger.info(f"✅ Actividad actualizada optimizada {activity_id} por usuario {current_user['user_id']}")
        
        return ActivityResponse.from_orm(activity)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error actualizando actividad optimizada {activity_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity_optimized(
    activity_id: int,
    request: Request,
):
    """
    Eliminar una actividad - OPTIMIZADO
    
    Características:
    - Usa master database para escritura
    - Invalidación automática de cache relacionado
    - Verificación de permisos
    """
    try:
        # Verificar permisos
        require_teacher_or_admin(request)
        
        current_user = get_current_user(request)
        
        # Eliminar usando el servicio optimizado
        success = optimized_service.delete_activity(
            activity_id,
            user_id=current_user["user_id"],
            user_role=current_user["role"]
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Actividad no encontrada o sin permisos para eliminar"
            )
        
        logger.info(f"✅ Actividad eliminada optimizada {activity_id} por usuario {current_user['user_id']}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error eliminando actividad optimizada {activity_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# ============================================================================
# ENDPOINTS AVANZADOS CON OPERACIONES CONCURRENTES
# ============================================================================

@router.post("/batch", response_model=List[Optional[ActivitySchema]])
async def get_multiple_activities_concurrent(
    activity_ids: List[int],
    user_id: Optional[int] = Header(None, alias="User_id")
):
    """
    Obtener múltiples actividades concurrentemente - AVANZADO
    
    Características:
    - Ejecución concurrente con ThreadPoolExecutor
    - Optimización para múltiples consultas
    - Cache aprovechado al máximo
    """
    try:
        if len(activity_ids) > 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Máximo 50 actividades por request"
            )
        
        # Obtener actividades concurrentemente
        activities = await optimized_service.get_multiple_activities_concurrent(activity_ids)
        
        logger.info(f"📊 Obtenidas {len(activities)} actividades concurrentemente")
        
        return activities
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error obteniendo actividades concurrentemente: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.post("/preload-cache/{course_id}")
async def preload_course_cache(
    course_id: int,
    request: Request
):
    """
    Precargar cache para un curso específico - UTILIDAD DE RENDIMIENTO
    
    Útil para:
    - Preparar cache antes de picos de tráfico
    - Warming up después de mantenimiento
    - Optimización proactiva
    """
    try:
        # Verificar permisos de admin
        require_teacher_or_admin(request)
        
        # Precargar cache
        success = optimized_service.preload_course_activities_cache(course_id)
        
        if success:
            logger.info(f"🚀 Cache precargado para curso {course_id}")
            return {"message": f"Cache precargado para curso {course_id}"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error precargando cache"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error precargando cache para curso {course_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# ============================================================================
# ENDPOINTS DE MONITOREO Y MÉTRICAS
# ============================================================================

@router.get("/metrics/performance")
async def get_performance_metrics(
    request: Request
):
    """
    Obtener métricas de rendimiento del servicio - MONITOREO
    
    Incluye:
    - Estadísticas de cache (hits, misses, ratios)
    - Estadísticas de connection pools
    - Información del servicio
    """
    try:
        # Verificar permisos de admin
        require_teacher_or_admin(request)
        
        # Obtener métricas
        metrics = optimized_service.get_performance_metrics()
        
        # Agregar timestamp
        metrics["timestamp"] = datetime.now().isoformat()
        
        logger.info("📊 Métricas de rendimiento solicitadas")
        
        return metrics
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error obteniendo métricas de rendimiento: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/health")
async def health_check():
    """
    Verificar salud del servicio optimizado - HEALTH CHECK
    
    Verifica:
    - Conexión a master database
    - Conexión a read replica
    - Conexión a Redis cache
    - Estado general del servicio
    """
    try:
        # Verificar salud del servicio
        health_status = optimized_service.health_check()
        
        # Determinar código de respuesta
        if health_status["overall_healthy"]:
            return health_status
        else:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=health_status
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error en health check: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.post("/cache/invalidate")
async def invalidate_cache(
    request: Request,
    course_id: Optional[int] = Query(None),
    activity_id: Optional[int] = Query(None),
    user_id: Optional[int] = Query(None)
):
    """
    Invalidar cache específico - UTILIDAD DE ADMINISTRACIÓN
    
    Permite invalidar cache de:
    - Curso específico
    - Actividad específica
    - Usuario específico
    """
    try:
        # Verificar permisos de admin
        require_teacher_or_admin(request)
        
        cache_service = CacheService()
        
        if course_id:
            cache_service.invalidate_course_cache(course_id)
            logger.info(f"🗑️ Cache invalidado para curso {course_id}")
        
        if activity_id:
            cache_service.invalidate_activity_cache(activity_id, course_id)
            logger.info(f"🗑️ Cache invalidado para actividad {activity_id}")
        
        if user_id:
            cache_service.invalidate_user_cache(user_id)
            logger.info(f"🗑️ Cache invalidado para usuario {user_id}")
        
        if not any([course_id, activity_id, user_id]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Debe especificar al menos un parámetro para invalidar"
            )
        
        return {"message": "Cache invalidado exitosamente"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error invalidando cache: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        ) 
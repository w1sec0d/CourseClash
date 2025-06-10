from fastapi import APIRouter, Depends, HTTPException, Request, status, Query, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.database import get_db
from app.models import Activity
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse, ActivityList, ActivitySchema
from app.middleware.auth import get_current_user, require_teacher_or_admin
from app.services.activity_service import ActivityService

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(
    activity_data: ActivityCreate,
    user_id : int = Header(..., alias = "User_id"),
    db: Session = Depends(get_db)
):
    """
    Crear una nueva actividad
    Solo disponible para profesores y administradores
    """
    try:
        
        # Crear la actividad
        service = ActivityService(db)
        activity = service.create_activity(activity_data, user_id)
        
        logger.info(f"Actividad creada: {activity.id} por usuario {user_id}")
        
        return ActivityResponse.from_orm(activity)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creando actividad: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/", response_model=ActivityList)
async def get_activities(
    request: Request,
    course_id: Optional[int] = Query(None, description="Filtrar por ID del curso"),
    activity_type: Optional[str] = Query(None, description="Filtrar por tipo de actividad"),
    page: int = Query(1, ge=1, description="Número de página"),
    size: int = Query(10, ge=1, le=100, description="Tamaño de página"),
    db: Session = Depends(get_db)
):
    """
    Obtener lista de actividades con filtros opcionales
    """
    try:
        current_user = get_current_user(request)
        
        service = ActivityService(db)
        result = service.get_activities(
            course_id=course_id,
            activity_type=activity_type,
            page=page,
            size=size,
            user_id=current_user["user_id"],
            user_role=current_user["role"]
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error obteniendo actividades: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/{activity_id}", response_model=ActivitySchema)
async def get_activity(
    activity_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtener una actividad específica por ID
    """
    try:
        service = ActivityService(db)
        activity = service.get_activity_by_id(
            activity_id
        )

        if not activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Actividad no encontrada"
            )
        
        return ActivitySchema.from_orm(activity)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo actividad {activity_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    activity_id: int,
    activity_data: ActivityUpdate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Actualizar una actividad existente
    Solo disponible para profesores y administradores que crearon la actividad
    """
    try:
        # Verificar permisos
        require_teacher_or_admin(request)
        
        current_user = get_current_user(request)
        
        service = ActivityService(db)
        activity = service.update_activity(
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
        
        logger.info(f"Actividad {activity_id} actualizada por usuario {current_user['user_id']}")
        
        return ActivityResponse.from_orm(activity)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error actualizando actividad {activity_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    activity_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Eliminar una actividad
    Solo disponible para profesores y administradores que crearon la actividad
    """
    try:
        # Verificar permisos
        require_teacher_or_admin(request)
        
        current_user = get_current_user(request)
        
        service = ActivityService(db)
        success = service.delete_activity(
            activity_id,
            user_id=current_user["user_id"],
            user_role=current_user["role"]
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Actividad no encontrada o sin permisos para eliminar"
            )
        
        logger.info(f"Actividad {activity_id} eliminada por usuario {current_user['user_id']}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error eliminando actividad {activity_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        ) 
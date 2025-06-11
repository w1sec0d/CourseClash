from fastapi import APIRouter, Depends, HTTPException, Request, status, Query, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.database import get_db
from app.schemas.submission import SubmissionCreate, SubmissionUpdate, SubmissionResponse, SubmissionList, SubmissionDetail
from app.schemas.grade import GradeCreate, GradeResponse
from app.middleware.auth import get_current_user, require_teacher_or_admin
from app.services.submission_service import SubmissionService
from app.services.grade_service import GradeService

logger = logging.getLogger(__name__)

router = APIRouter()

#Ya
@router.post("/", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_submission(
    submission_data: SubmissionCreate,
    user_id: int = Header(..., alias = "User_id"),
    db: Session = Depends(get_db)
):
    """
    Crear una nueva entrega para una actividad
    Solo disponible para estudiantes dentro del plazo límite
    """
    try:
        
        
        service = SubmissionService(db)
        submission = service.create_submission(submission_data, user_id)
        
        logger.info(f"Entrega creada: {submission.id} por usuario {user_id}")
        
        return SubmissionResponse.from_orm(submission)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creando entrega: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {e}"
        )

#Ya
#Obtener las submisiones para el estudiante solo ve sus propias entregas 
# y el profesor ve todas las entregas de sus actividades
@router.get("/", response_model=SubmissionList)
async def get_submissions(
    activity_id: int = Query(..., description="Identificador de la actividad"),
    user_id: int = Query(..., description="Identificador del usuario"),
    user_role: str = Query(..., description="Rol del usuario (student, teacher o admin)"),
    db: Session = Depends(get_db)
):
    """
    Obtener lista de entregas con filtros opcionales
    Los estudiantes solo ven sus propias entregas
    Los profesores pueden ver todas las entregas de sus actividades
    """
    try:
        
        service = SubmissionService(db)
        result = service.get_submissions(
            activity_id=activity_id,
            user_id=user_id,
            user_role=user_role.lower()
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error obteniendo entregas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission(
    submission_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Obtener una entrega específica por ID
    """
    try:
        current_user = get_current_user(request)
        
        service = SubmissionService(db)
        submission = service.get_submission_by_id(
            submission_id,
            current_user_id=current_user["user_id"],
            current_user_role=current_user["role"]
        )
        
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Entrega no encontrada"
            )
        
        return SubmissionResponse.from_orm(submission)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo entrega {submission_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

#Ya
#Actualizar una entrega existente
@router.put("/{submission_id}", response_model=SubmissionResponse)
async def update_submission(
    submission_id: int,
    submission_data: SubmissionUpdate,
    user_id : int = Query(..., description="Identificador del usuario"),
    db: Session = Depends(get_db)
):
    """
    Actualizar una entrega existente
    Solo disponible para el estudiante que la creó y antes de la fecha límite
    """
    try:
        
        service = SubmissionService(db)
        submission = service.update_submission(
            submission_id,
            submission_data,
            user_id=user_id
        )
        
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Entrega no encontrada o no se puede editar"
            )
        
        logger.info(f"Entrega {submission_id} actualizada por usuario {user_id}")
        
        return SubmissionResponse.from_orm(submission)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error actualizando entrega {submission_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.delete("/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_submission(
    submission_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Eliminar una entrega
    Solo disponible para el estudiante que la creó y antes de la fecha límite
    """
    try:
        current_user = get_current_user(request)
        
        service = SubmissionService(db)
        success = service.delete_submission(
            submission_id,
            current_user_id=current_user["user_id"]
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Entrega no encontrada o no se puede eliminar"
            )
        
        logger.info(f"Entrega {submission_id} eliminada por usuario {current_user['user_id']}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error eliminando entrega {submission_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

# Endpoints para calificaciones
@router.post("/{submission_id}/grade", response_model=GradeResponse, status_code=status.HTTP_201_CREATED)
async def grade_submission(
    submission_id: int,
    grade_data: GradeCreate,
    User_id: int = Header(..., alias = "User_id"), #indentificador del profesor o admin
    user_role: str = Query(..., description="Rol del usuario (teacher o admin)"),
    db: Session = Depends(get_db)
):
    """
    Calificar una entrega
    Solo disponible para profesores y administradores después de la fecha límite
    """
    try:

        # Verificando permisos
        if user_role.lower() not in ["teacher", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso denegado: solo profesores y administradores pueden calificar"
            )

        service = GradeService(db)
        grade = service.create_grade(grade_data, graded_by=User_id, submission_id=submission_id)
        
        logger.info(f"Calificación creada para entrega {submission_id} por usuario {User_id}")
        
        return GradeResponse.from_orm(grade)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calificando entrega {submission_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/{submission_id}/grade", response_model=GradeResponse)
async def get_submission_grade(
    submission_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Obtener la calificación de una entrega
    """
    try:
        current_user = get_current_user(request)
        
        service = GradeService(db)
        grade = service.get_grade_by_submission(
            submission_id,
            current_user_id=current_user["user_id"],
            current_user_role=current_user["role"]
        )
        
        if not grade:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Calificación no encontrada"
            )
        
        return GradeResponse.from_orm(grade)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo calificación de entrega {submission_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.put("/{submission_id}/grade", response_model=GradeResponse)
async def update_submission_grade(
    submission_id: int,
    grade_data: GradeCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Actualizar la calificación de una entrega
    Solo disponible para profesores y administradores
    """
    try:
        # Verificar permisos
        require_teacher_or_admin(request)
        
        current_user = get_current_user(request)
        
        service = GradeService(db)
        grade = service.update_grade_by_submission(
            submission_id,
            grade_data,
            current_user_id=current_user["user_id"]
        )
        
        if not grade:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Calificación no encontrada"
            )
        
        logger.info(f"Calificación actualizada para entrega {submission_id} por usuario {current_user['user_id']}")
        
        return GradeResponse.from_orm(grade)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error actualizando calificación de entrega {submission_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        ) 
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.models.comment import Comment
from app.models.activity import Activity
from app.schemas.comment import CommentCreate, CommentResponse

logger = logging.getLogger(__name__)

class CommentService:
    def __init__(self, db: Session):
        self.db = db

    def create_comment(self, comment_data: CommentCreate, user_id: int, activity_id: int) -> CommentResponse:
        """
        Crear un nuevo comentario en una actividad
        """
        try:

            # Valida que la actividad existe
            activity = self.db.query(Activity).filter(Activity.id == activity_id).first()
            if not activity:
                raise ValueError("La actividad no existe")

            db_comment = Comment(
                activity_id=activity_id,
                user_id=user_id,
                content=comment_data.content
            )
            self.db.add(db_comment)
            self.db.commit()
            self.db.refresh(db_comment)

            logger.info(f"Comentario creado: {db_comment.id}")
            return CommentResponse.from_orm(db_comment)

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creando comentario: {e}")
            raise

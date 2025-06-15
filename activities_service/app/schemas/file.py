from pydantic import BaseModel, Field
from typing import Optional

class FileResponse(BaseModel):
    """Schema for file upload response"""
    filename: str = Field(..., description="Nombre del archivo")
    file_url: str = Field(..., description="URL del archivo subido")
    file_size: int = Field(..., description="Tamaño del archivo en bytes")
    content_type: str = Field(..., description="Tipo de contenido del archivo")
    upload_success: bool = Field(..., description="Éxito en la subida")
    message: str = Field(..., description="Mensaje de confirmación")

class FileUploadError(BaseModel):
    """Schema for file upload error response"""
    error: str = Field(..., description="Descripción del error")
    details: Optional[str] = Field(None, description="Detalles adicionales del error")
    upload_success: bool = Field(default=False, description="Éxito en la subida") 
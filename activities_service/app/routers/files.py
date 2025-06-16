from fastapi import APIRouter, Depends, HTTPException, Request, status, UploadFile, File
from fastapi.responses import FileResponse
from typing import List
import os
import uuid
import logging
from pathlib import Path
import aiofiles

from app.schemas.file import FileResponse as FileResponseSchema, FileUploadError
from app.middleware.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()

# Configuración de archivos
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {
    'pdf', 'doc', 'docx', 'txt', 'rtf',  # Documentos
    'jpg', 'jpeg', 'png', 'gif', 'bmp',  # Imágenes
    'mp4', 'avi', 'mov', 'wmv',  # Videos
    'zip', 'rar', '7z',  # Archivos comprimidos
    'xls', 'xlsx', 'ppt', 'pptx'  # Office
}
UPLOAD_DIRECTORY = "uploads"

# Crear directorio de uploads si no existe
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

def validate_file(file: UploadFile) -> dict:
    """
    Valida un archivo según el tamaño y extensión permitida
    """
    # Validar extensión
    if file.filename:
        extension = file.filename.split('.')[-1].lower()
        if extension not in ALLOWED_EXTENSIONS:
            return {
                "valid": False,
                "error": f"Extensión de archivo no permitida: {extension}",
                "details": f"Extensiones permitidas: {', '.join(ALLOWED_EXTENSIONS)}"
            }
    
    # Validar tipo de contenido
    if not file.content_type:
        return {
            "valid": False,
            "error": "Tipo de contenido no especificado"
        }
    
    return {"valid": True}

def get_file_size(file: UploadFile) -> int:
    """
    Obtiene el tamaño del archivo
    """
    file.file.seek(0, 2)  # Moverse al final del archivo
    size = file.file.tell()  # Obtener la posición (tamaño)
    file.file.seek(0)  # Volver al inicio
    return size

@router.post("/upload", response_model=FileResponseSchema)
async def upload_file(
    request: Request,
    file: UploadFile = File(..., description="Archivo a subir")
):
    """
    Subir un archivo al servidor
    Límite: 50MB, extensiones permitidas: documentos, imágenes, videos, archivos comprimidos
    """
    try:
        current_user = get_current_user(request)
        
        # Validar archivo
        validation = validate_file(file)
        if not validation["valid"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=validation["error"]
            )
        
        # Validar tamaño
        file_size = get_file_size(file)
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Archivo demasiado grande. Máximo permitido: {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Generar nombre único para el archivo
        file_extension = file.filename.split('.')[-1].lower() if file.filename else 'bin'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
        
        # Guardar archivo
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Generar URL del archivo
        file_url = f"/api/v1/files/download/{unique_filename}"
        
        logger.info(f"Archivo subido: {unique_filename} por usuario {current_user['user_id']}")
        
        return FileResponseSchema(
            filename=file.filename or unique_filename,
            file_url=file_url,
            file_size=file_size,
            content_type=file.content_type,
            upload_success=True,
            message="Archivo subido exitosamente"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error subiendo archivo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al subir archivo"
        )

@router.post("/upload-multiple", response_model=List[FileResponseSchema])
async def upload_multiple_files(
    request: Request,
    files: List[UploadFile] = File(..., description="Archivos a subir")
):
    """
    Subir múltiples archivos al servidor
    """
    try:
        current_user = get_current_user(request)
        
        if len(files) > 10:  # Límite de archivos por petición
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Máximo 10 archivos por petición"
            )
        
        results = []
        
        for file in files:
            try:
                # Validar archivo
                validation = validate_file(file)
                if not validation["valid"]:
                    results.append(FileUploadError(
                        error=validation["error"],
                        details=validation.get("details")
                    ))
                    continue
                
                # Validar tamaño
                file_size = get_file_size(file)
                if file_size > MAX_FILE_SIZE:
                    results.append(FileUploadError(
                        error=f"Archivo {file.filename} demasiado grande",
                        details=f"Máximo permitido: {MAX_FILE_SIZE // (1024*1024)}MB"
                    ))
                    continue
                
                # Generar nombre único
                file_extension = file.filename.split('.')[-1].lower() if file.filename else 'bin'
                unique_filename = f"{uuid.uuid4()}.{file_extension}"
                file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
                
                # Guardar archivo
                async with aiofiles.open(file_path, 'wb') as f:
                    content = await file.read()
                    await f.write(content)
                
                file_url = f"/api/v1/files/download/{unique_filename}"
                
                results.append(FileResponseSchema(
                    filename=file.filename or unique_filename,
                    file_url=file_url,
                    file_size=file_size,
                    content_type=file.content_type,
                    upload_success=True,
                    message="Archivo subido exitosamente"
                ))
                
            except Exception as e:
                logger.error(f"Error subiendo archivo {file.filename}: {e}")
                results.append(FileUploadError(
                    error=f"Error subiendo {file.filename}",
                    details=str(e)
                ))
        
        logger.info(f"Subida múltiple completada por usuario {current_user['user_id']}: {len(results)} archivos")
        
        return results
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en subida múltiple: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.get("/download/{filename}")
async def download_file(
    filename: str,
    request: Request
):
    """
    Descargar un archivo del servidor
    """
    try:
        current_user = get_current_user(request)
        
        file_path = os.path.join(UPLOAD_DIRECTORY, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Archivo no encontrado"
            )
        
        # Verificar que el archivo esté dentro del directorio permitido
        if not os.path.abspath(file_path).startswith(os.path.abspath(UPLOAD_DIRECTORY)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso al archivo denegado"
            )
        
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type='application/octet-stream'
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error descargando archivo {filename}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.delete("/delete/{filename}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(
    filename: str,
    request: Request
):
    """
    Eliminar un archivo del servidor
    Solo para profesores/administradores o el usuario que lo subió
    """
    try:
        current_user = get_current_user(request)
        
        file_path = os.path.join(UPLOAD_DIRECTORY, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Archivo no encontrado"
            )
        
        # Verificar permisos (aquí podrías implementar una lógica más sofisticada
        # para verificar quién subió el archivo)
        user_role = current_user.get("role", "student")
        if user_role not in ["teacher", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sin permisos para eliminar archivos"
            )
        
        # Eliminar archivo
        os.remove(file_path)
        
        logger.info(f"Archivo eliminado: {filename} por usuario {current_user['user_id']}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error eliminando archivo {filename}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        ) 
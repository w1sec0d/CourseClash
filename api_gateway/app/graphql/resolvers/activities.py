"""
Módulo de Resolvers de Actividades para GraphQL

Este módulo implementa las operaciones relacionadas con las actividades de cursos
del API Gateway de CourseClash utilizando GraphQL.
"""

import strawberry
from typing import List, Optional
from datetime import datetime
from enum import Enum
import httpx
import os

#Variable de entorno para ms de actividades
ACTIVITIES_SERVICE_URL = os.getenv("ACTIVITIES_SERVICE_URL", "http://course_service:8003")

#Variable de entorno para ms de autenticacion
# Environment variables
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth_user_service:8000")



@strawberry.enum
class TypeActivity(Enum):
    TASK = "task"
    QUIZ = "quiz"
    ANNOUNCEMENT = "announcement"

@strawberry.type
class Comment:
    id: int
    user_id: int
    content: str
    created_at: datetime

#Añade esquema para de volver al front-end
@strawberry.type
class Activity:
    id: int 
    course_id: int
    title: str
    description: Optional[str] = None
    activity_type: TypeActivity
    due_date: Optional[datetime] = None
    file_url: Optional[str] = None
    created_at: datetime
    created_by: int
    comments: Optional[List[Comment]] = None

@strawberry.type
class ActivitySuccess: 
    activity: Activity

@strawberry.type
class ActivityError: 
    message: str
    code: str

#Union para la respuesta de la creación de la actividad
ActivityResult = strawberry.union("ActivityResult", (ActivitySuccess, ActivityError))

@strawberry.type
class Query:
    @strawberry.field
    async def activity(self, id: str) -> Optional[Activity]:
        """
        Obtiene la información de una actividad en especifico. 
        Se requiere el id de la actividad

        Returns:
            Optional[Activity]: De vuelve la información de la actividad junto con sus comentarios
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{ACTIVITIES_SERVICE_URL}/api/activities/{id}"
                )

                if response.status_code != 200:
                    return None
                
                data = response.json()

                #Mapeo de los comentarios a una instancia de Comment
                comments = [
                    Comment(
                        id=comment["id"],
                        user_id=comment["user_id"],
                        content=comment["content"],
                        created_at=datetime.fromisoformat(comment["created_at"])
                    )
                    for comment in data.get("comments",[])
                ]

                activity_obj = Activity(
                    id=data["id"],
                    course_id=data["course_id"],
                    title=data["title"],
                    description=data.get("description"),
                    activity_type=TypeActivity(data["activity_type"]),
                    due_date=datetime.fromisoformat(data["due_date"]) if data.get("due_date") else None,
                    file_url=data.get("file_url"),
                    created_at=datetime.fromisoformat(data["created_at"]),
                    created_by=data["created_by"],
                    comments=comments
                )

                return activity_obj
                

        except Exception as e:
            print("❌ Error in me query:", str(e))
            return None

@strawberry.type
class Mutation: 
    @strawberry.mutation
    async def createActivity(
        self, 
        info,
        course_id: int,
        title: str,
        activity_type: TypeActivity,
        description: Optional[str] = None,
        due_date: Optional[datetime] = None,
        file_url: Optional[str] = None

    ) -> ActivityResult:
        """
        Registra un nueva actividad en el sistema.

        Args:
            course_id (int): Identificador del curso
            title (str): Titulo de la actividad
            activity_type (TypeActivity): Tipo de actividad
            description (Optional[str]): Descripcion de la actividad
            dua_date: (Optional[Datetime]): Fecha limite de entrega
            file_url (Optional[str]): Url del archivo

        Returns:
            Activity: Resultado de la actividad creada
        """

        #Obtenemos el token enviado en el header
        request = info.context["request"]

        # Intentar obtener el token desde el header Authorization
        auth_header = request.headers.get("authorization")
        token = None

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            # Si no hay header Authorization, intentar obtener desde cookies
            token = request.cookies.get("auth_token")

        if not token:
            return ActivityError(message = "Token no proporcionado", code = "401")
        
        #Verifica el token
        try: 
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{AUTH_SERVICE_URL}/auth/me",
                    headers={"Authorization": f"Bearer {token}"},
                )

                if response.status_code != 200:
                    return ActivityError(message = "Token invalido o expirado", code = "401")
            user_data = response.json()
        except Exception as e: 
            print("❌ Error in la verificación del token :", str(e))
            return ActivityError(message = "Error al verificar el token ", code = "401")
        

        #Creación de la actividad en el microservicio
        try: 
            async with httpx.AsyncClient(timeout=10.0) as client:
                activity_payload = {
                    "course_id": course_id,
                    "title": title,
                    "description": description,
                    "activity_type": activity_type.value,  
                    "due_date": due_date.isoformat() if due_date else None,
                    "file_url": file_url
                }

                activity_response = await client.post(
                    f"{ACTIVITIES_SERVICE_URL}/api/activities/",
                    json = activity_payload,
                    headers={"User_id": str(user_data["id"])}
                )

                if activity_response.status_code != 201: 
                    error_data = activity_response.json()
                    error_detail = "Credenciales inválidas"
                    error_code = "AUTHENTICATION_ERROR"

                    if "detail" in error_data:
                        if isinstance(error_data["detail"], dict):
                            error_detail = error_data["detail"].get(
                                "message", error_detail
                            )
                            error_code = error_data["detail"].get("code", error_code)
                        else:
                            error_detail = error_data["detail"]
                    return ActivityError(message=error_detail, code=error_code)

                activity_data = activity_response.json()
                created_activity = Activity(
                    id=activity_data["id"],
                    course_id=activity_data["course_id"],
                    title=activity_data["title"],
                    description=activity_data.get("description"),
                    activity_type=TypeActivity(activity_data["activity_type"]),
                    due_date=datetime.fromisoformat(activity_data["due_date"].replace("Z", "+00:00"))
                        if activity_data.get("due_date") else None,
                    file_url=activity_data.get("file_url"),
                    created_at=datetime.fromisoformat(activity_data["created_at"].replace("Z", "+00:00")),
                    created_by=activity_data["created_by"]
                )
                return ActivitySuccess(activity = created_activity)
        except Exception as e: 
            print("❌ Error al crear la actividad:", str(e))
            return ActivityError(message="Error al registrar la actividad", code="ACT002")



    
    
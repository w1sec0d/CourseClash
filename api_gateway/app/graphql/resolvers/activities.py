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

# Esquema para enviar los detalles de la calificación de una submisión
@strawberry.type
class gradeSubmission:
    id: int
    graded_by: int
    graded_at: Optional[datetime] = None
    score: float
    feedback: Optional[str] = None

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
class Submissions:
    id: int
    activity_id: int
    submitted_at: Optional[datetime] = None
    content: Optional[str] = None
    file_url: Optional[str] = None
    additional_files: Optional[List[str]] = None
    is_graded: bool
    can_edit: bool
    latest_grade: Optional[gradeSubmission] = None 

@strawberry.type
class Grade:
    id: int
    submission_id: int
    graded_by: int
    graded_at: Optional[datetime] = None
    score: float
    feedback: Optional[str] = None
    score_percentage: Optional[float] = None

@strawberry.type
class SubmissionsSuccess: 
    submission: Submissions 

@strawberry.type
class SubmissionsError: 
    message: str
    code: str

@strawberry.type
class ActivitySuccess: 
    activity: Activity

@strawberry.type
class ActivityError: 
    message: str
    code: str

#Resul para lista de actividades
@strawberry.type
class ActivitiesSuccess:
    activities: List[Activity]

@strawberry.type
class ActivitiesError:
    message: str
    code: str

#Result para listar las submisiones 
@strawberry.type
class SubmissionsSuccessList: 
    submission: List[Submissions] 

@strawberry.type
class SubmissionsErrorList: 
    message: str
    code: str

#Result para calificaciones
@strawberry.type
class GradeSuccess: 
    grades: Grade 

@strawberry.type
class GradeError: 
    message: str
    code: str

#Unio para la respuesta de actividades
ActivitiesResult = strawberry.union("ActivitiesResult", (ActivitiesSuccess, ActivitiesError))

#Union para la respuesta de la creación de la actividad
ActivityResult = strawberry.union("ActivityResult", (ActivitySuccess, ActivityError))

#Union para la respuesta de la creación de la submision
SubmissionResult = strawberry.union("SubmissionResult", (SubmissionsSuccess, SubmissionsError))

#Union para la respuesta de la creación de la submision
SubmissionsResult = strawberry.union("SubmissionsResult", (SubmissionsSuccessList, SubmissionsErrorList))

GradeResult = strawberry.union("GradeResult", (GradeSuccess, GradeError))

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

    @strawberry.field
    async def activities(self, id_course: str) -> ActivitiesResult:
        """
            Obtiene la información de las actividades asociadas a un curso. 
            Se requiere el id del curso

            Returns:
                Optional[Activity]: De vuelve una lista de actividades asociadas a un curso
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{ACTIVITIES_SERVICE_URL}/api/activities/list/{id_course}"
                )

                if response.status_code != 200:
                    error_data = response.json()
                    error_detail = "Ocurrio un problema en el servidor"
                    error_code = "INTERNAL_SERVER_ERROR"

                    if "detail" in error_data:
                        if isinstance(error_data["detail"], dict):
                            error_detail = error_data["detail"].get(
                                "message", error_detail
                            )
                            error_code = error_data["detail"].get("code", error_code)
                        else:
                            error_detail = error_data["detail"]
                    return ActivitiesError(message=error_detail, code=error_code)
                
                data = response.json()
                activities_data = data.get("activities", [])
                activities_list = []
                for activity in activities_data:

                    due_date_str = activity.get("due_date")
                    created_at_str = activity.get("created_at")
            
                    due_date = datetime.fromisoformat(due_date_str.replace("Z", "+00:00")) if due_date_str else None
                    created_at = datetime.fromisoformat(created_at_str.replace("Z", "+00:00")) if created_at_str else None

                    activity["due_date"] = due_date
                    activity["created_at"] = created_at

                    activity_instance = Activity(**activity)
                    activities_list.append(activity_instance)

                return ActivitiesSuccess(activities = activities_list)

        except Exception as e:
            print("❌ Error in me query:", str(e))
            return ActivitiesError(message = "Error interno en el servidor", code = "500")
        
    @strawberry.field
    async def submissions(self, activity_id: str, user_id: str, user_role: str) -> SubmissionsResult:
        """
        Obtiene la lista de envios o submisiones de una actividad en especifico.
        Se requiere el id de la actividad, el id del usuario y el rol del usuario (student o teacher o admin).

        Args:
            activity_id (str): Identificador de la actividad
            user_id (str): Identificador del usuario
            user_role (str): Rol del usuario (student o teacher o admin)

        Returns:
            SubmissionResult: Resultado de las submisiones obtenidas
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{ACTIVITIES_SERVICE_URL}/api/submissions/",
                    params={"activity_id": activity_id, "user_id": user_id, "user_role": user_role}
                )

                if response.status_code != 200:
                    error_data = response.json()
                    error_detail = "Ocurrio un problema en el servidor"
                    error_code = "INTERNAL_SERVER_ERROR"

                    if "detail" in error_data:
                        if isinstance(error_data["detail"], dict):
                            error_detail = error_data["detail"].get(
                                "message", error_detail
                            )
                            error_code = error_data["detail"].get("code", error_code)
                        else:
                            error_detail = error_data["detail"]
                    return SubmissionsErrorList(message=str(error_detail), code=error_code)


                data = response.json()
                submissions_data = data.get("submissions", [])
                submissions_list = []
                for submission in submissions_data:

                    submitted_at_str = submission.get("submitted_at")
            
                    submitted_at = datetime.fromisoformat(submitted_at_str.replace("Z", "+00:00")) if submitted_at_str else None

                    submission["submitted_at"] = submitted_at
                    submission.pop("user_id", None)  # Elimina el campo user_id si existe

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

                    #Mapeo de la calificación si existe
                    latest_grade = submission.get("latest_grade")
                    if latest_grade:
                        latest_grade = gradeSubmission(
                            id=latest_grade["id"],
                            graded_by=latest_grade["graded_by"],
                            graded_at=datetime.fromisoformat(latest_grade["graded_at"].replace("Z", "+00:00"))
                                if latest_grade.get("graded_at") else None,
                            score=latest_grade["score"],
                            feedback=latest_grade.get("feedback")
                        )
                        submission["latest_grade"] = latest_grade

                    submission_instance = Submissions(**submission)
                    submissions_list.append(submission_instance)

                return SubmissionsSuccessList(submission=submissions_list)

        except Exception as e:
            print("❌ Error in me query:", str(e))
            # Ejemplo: si e es un error de validación de Pydantic
            try:
                errors = e.errors()  # Esto retorna una lista de errores, si es que e tiene ese método.
                error_msg = "; ".join([f"{'.'.join(map(str, err.get('loc', [])))}: {err.get('msg')}" for err in errors])
            except Exception:
                error_msg = str(e)
            return SubmissionsErrorList(message=str(error_msg), code="SERVICE_ERROR")
            #return SubmissionsErrorList(message="Error interno en el servidor", code="500")

        

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
        
    @strawberry.mutation
    async def createSubmissions(
        self,
        info,
        activity_id: int,
        content: Optional[str] = None,
        file_url: Optional[str] = None,
        additional_files: Optional[List[str]] = None
    ) -> SubmissionResult:
        """
        Registra una submission o envio por parte de un estudiante.

        Args:
            activity_id (int): Identificador de la actividad
            content (str): Contenido del envio o la submision
            file_url (Optional[str]): Url del archivo
            additional_files (Optional[List[str]]): Lista de archivos adicionales

        Returns:
            Submissions Resultado de la actividad creada
        
        Adicional: Se debe enviar el token de autenticación en el header 
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
            return SubmissionsError(message = "Token no proporcionado", code = "401")
        
        #Verifica el token
        try: 
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{AUTH_SERVICE_URL}/auth/me",
                    headers={"Authorization": f"Bearer {token}"},
                )

                if response.status_code != 200:
                    return SubmissionsError(message = "Token invalido o expirado", code = "401")
            user_data = response.json()
        except Exception as e: 
            print("❌ Error in la verificación del token :", str(e))
            return SubmissionsError(message = "Error al verificar el token ", code = "401")
        
        #Creación de la submisión del envio
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                submission_payload = {
                    "activity_id": activity_id,
                    "content": content,
                    "file_url": file_url,
                    "additional_files": additional_files
                }

                submission_response = await client.post(
                    f"{ACTIVITIES_SERVICE_URL}/api/submissions/",
                    json = submission_payload,
                    headers={"User_id": str(user_data["id"])}
                )

                if submission_response.status_code != 201: 
                    error_data = submission_response.json()
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
                    return SubmissionsError(message=error_detail, code=error_code)
                
                submission_data = submission_response.json()
                created_submission = Submissions(
                    id = submission_data["id"],
                    activity_id = submission_data["activity_id"],
                    submitted_at = datetime.fromisoformat(submission_data["submitted_at"].replace("Z", "+00:00"))
                        if submission_data.get("submitted_at") else None,
                    content = submission_data["content"],
                    file_url = submission_data["file_url"],
                    additional_files = submission_data["additional_files"],
                    is_graded = submission_data["is_graded"],
                    can_edit = submission_data["can_edit"],
                    latest_grade = submission_data["latest_grade"]
                )

                return SubmissionsSuccess(submission = created_submission)

        except Exception as e: 
            print("❌ Error al crear la submision:", str(e))
            return SubmissionsError(message="Error al registrar la Submision", code="ACT002")
    

    @strawberry.mutation
    async def updateSubmission(
        self,
        info,
        submission_id: int,
        content: Optional[str] = None,
        file_url: Optional[str] = None,
        additional_files: Optional[List[str]] = None
    ) -> SubmissionResult:
        """
        Actualiza una submission o envio por parte de un estudiante.

        Args:
            submission_id (int): Identificador de la submission
            content (str): Contenido del envio o la submision
            file_url (Optional[str]): Url del archivo
            additional_files (Optional[List[str]]): Lista de archivos adicionales

        Returns:
            Submissions Resultado de la actividad actualizada

        Adicional: Se debe enviar el token de autenticación en el header
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
            return SubmissionsError(message = "Token no proporcionado", code = "401")
        
        #Verifica el token
        try: 
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{AUTH_SERVICE_URL}/auth/me",
                    headers={"Authorization": f"Bearer {token}"},
                )

                if response.status_code != 200:
                    return SubmissionsError(message = "Token invalido o expirado", code = "401")
            user_data = response.json()
        except Exception as e: 
            print("❌ Error in la verificación del token :", str(e))
            return SubmissionsError(message = "Error al verificar el token ", code = "401")
        
        #Actualización de la submisión del envio
        try: 
            async with httpx.AsyncClient(timeout=10.0) as client:
                submission_payload = {
                    "content": content,
                    "file_url": file_url,
                    "additional_files": additional_files
                }

                submission_response = await client.put(
                    f"{ACTIVITIES_SERVICE_URL}/api/submissions/{submission_id}",
                    params={"user_id": user_data["id"]},
                    json = submission_payload
                )

                if submission_response.status_code != 200: 
                    error_data = submission_response.json()
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
                    return SubmissionsError(message=error_detail, code=str(submission_response.status_code))

                submission_data = submission_response.json()
                updated_submission = Submissions(
                    id = submission_data["id"],
                    activity_id = submission_data["activity_id"],
                    submitted_at = datetime.fromisoformat(submission_data["submitted_at"].replace("Z", "+00:00"))
                        if submission_data.get("submitted_at") else None,
                    content = submission_data["content"],
                    file_url = submission_data["file_url"],
                    additional_files = submission_data["additional_files"],
                    is_graded = submission_data["is_graded"],
                    can_edit = submission_data["can_edit"],
                    latest_grade = submission_data["latest_grade"]
                )

                return SubmissionsSuccess(submission=updated_submission)

        except Exception as e: 
            print("❌ Problemas en el servidor:", str(e))
            return SubmissionsError(message = "Error en el servidor", code = "501")
        
    @strawberry.mutation
    async def gradeSubmission(
        self,
        info,
        score: float,
        submission_id: int,
        feedback: Optional[str] = None,
    ) -> GradeResult:
        """
        Califica una submisión de un estudiante.

        Args:
            score (float): Calificacion de la submisión
            feedback (Optional[str]): Retroalimentación para el estudiante

        Returns:
            Submissions Resultado de la actividad actualizada

        Adicional: Se debe enviar el token de autenticación en el header
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
            return GradeError(message = "Token no proporcionado", code = "401")

        #Verifica el token
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{AUTH_SERVICE_URL}/auth/me",
                    headers={"Authorization": f"Bearer {token}"},
                )

                if response.status_code != 200:
                    return GradeError(message = "Token invalido o expirado", code = "401")
            user_data = response.json()
        except Exception as e:
            print("❌ Error in la verificación del token :", str(e))
            return GradeError(message = "Error al verificar el token ", code = "401")

        #Calificación de la submisión
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:

                grade_payload = {
                    "score": score,
                    "feedback": feedback
                }

                grade_response = await client.post(
                    f"{ACTIVITIES_SERVICE_URL}/api/submissions/{submission_id}/grade",
                    params={"user_role": "TEACHER" if user_data["is_superuser"] else "STUDENT"},
                    headers={"User_id": str(user_data["id"])},
                    json=grade_payload
                )

                if grade_response.status_code != 201:
                    error_data = grade_response.json()
                    # error_detail = "Credenciales inválidas"
                    # error_code = "AUTHENTICATION_ERROR"

                    # if "detail" in error_data:
                    #     if isinstance(error_data["detail"], dict):
                    #         error_detail = error_data["detail"].get(
                    #             "message", error_detail
                    #         )
                    #         error_code = error_data["detail"].get("code", error_code)
                    #     else:
                    #         error_detail = error_data["detail"]
                    # return GradeError(message=error_detail, code=str(grade_response.status_code))
                    return GradeError(
                        message=error_data.get("detail", "Error inesperado en el microservicio"),
                        code=str(grade_response.status_code)
                    )

                grade_data = grade_response.json()

                grade = Grade(
                    id = grade_data['id'],
                    submission_id = grade_data['submission_id'],
                    graded_by = grade_data['graded_by'],
                    graded_at = datetime.fromisoformat(grade_data["graded_at"].replace("Z", "+00:00"))
                        if grade_data.get("graded_at") else None,
                    score = grade_data['score'],
                    feedback = grade_data['feedback'],
                    score_percentage = grade_data['score_percentage']
                )


                return GradeSuccess(grades=grade)
        except Exception as e:
            print("❌ Problemas en el servidor:", str(e))
            return GradeError(message="Error en el servidor", code="501")

        



    
    
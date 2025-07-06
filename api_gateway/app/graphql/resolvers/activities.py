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

# Variables de entorno para microservicios
ACTIVITIES_SERVICE_URL = os.getenv("ACTIVITIES_SERVICE_URL", "http://cc_activities_ms:8003")
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth_user_service:8000")



@strawberry.enum
class TypeActivity(Enum):
    TASK = "task"
    QUIZ = "quiz"
    ANNOUNCEMENT = "announcement"

@strawberry.type
class Comment:
    id: int
    userId: int
    content: str
    createdAt: datetime

# Esquema para enviar los detalles de la calificación de una submisión
@strawberry.type
class gradeSubmission:
    id: int
    gradedBy: int
    gradedAt: Optional[datetime] = None
    score: float
    feedback: Optional[str] = None

#Añade esquema para de volver al front-end
@strawberry.type
class Activity:
    id: int 
    courseId: int
    title: str
    description: Optional[str] = None
    activityType: TypeActivity
    dueDate: Optional[datetime] = None
    fileUrl: Optional[str] = None
    createdAt: datetime
    createdBy: int
    comments: Optional[List[Comment]] = None


@strawberry.type
class Submissions:
    id: int
    activityId: int
    submittedAt: Optional[datetime] = None
    content: Optional[str] = None
    fileUrl: Optional[str] = None
    additionalFiles: Optional[List[str]] = None
    isGraded: bool
    canEdit: bool
    latestGrade: Optional[gradeSubmission] = None 

@strawberry.type
class Grade:
    id: int
    submissionId: int
    gradedBy: int
    gradedAt: Optional[datetime] = None
    score: float
    feedback: Optional[str] = None
    scorePercentage: Optional[float] = None

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

#Result para comentarios
@strawberry.type
class CommentSuccess: 
    id: int
    activityId: int
    content: str
    createdAt: datetime

@strawberry.type
class CommentError:
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

#Union para la respuesta de la calificación
GradeResult = strawberry.union("GradeResult", (GradeSuccess, GradeError))

#Union para la respuesta de los comentarios
CommentResult = strawberry.union("CommentResult", (CommentSuccess, CommentError))

def _get_sample_activities(course_id: str) -> "ActivitiesResult":
    """Devuelve actividades de muestra para el curso especificado"""
    sample_activities = []
    
    # Actividades de muestra para el curso de Matemáticas Avanzadas (curso_id = "1")
    if course_id == "1":
        sample_activities = [
            Activity(
                id=1,
                courseId=1,
                title="Examen Parcial - Derivadas",
                description="Evaluación de conocimientos sobre derivadas y sus aplicaciones",
                activityType=TypeActivity.QUIZ,
                dueDate=datetime(2024, 3, 15, 23, 59, 59),
                createdAt=datetime(2024, 2, 20, 10, 0, 0),
                createdBy=1,
                comments=[]
            ),
            Activity(
                id=2,
                courseId=1,
                title="Tarea: Ejercicios de Integrales",
                description="Resolver los ejercicios 1-15 del capítulo 4. Entregar en formato PDF.",
                activityType=TypeActivity.TASK,
                dueDate=datetime(2024, 3, 20, 23, 59, 59),
                createdAt=datetime(2024, 2, 25, 14, 30, 0),
                createdBy=1,
                comments=[]
            ),
            Activity(
                id=3,
                courseId=1,
                title="Anuncio: Cambio de Horario",
                description="La clase del viernes 22 de marzo se trasladará al aula 205. Hora: 10:00 AM",
                activityType=TypeActivity.ANNOUNCEMENT,
                createdAt=datetime(2024, 3, 1, 9, 0, 0),
                createdBy=1,
                comments=[]
            )
        ]
    else:
        # Actividades genéricas para otros cursos
        sample_activities = [
            Activity(
                id=100,
                courseId=int(course_id),
                title="Actividad de Ejemplo",
                description="Esta es una actividad de muestra para el curso",
                activityType=TypeActivity.TASK,
                dueDate=datetime(2024, 4, 15, 23, 59, 59),
                createdAt=datetime(2024, 3, 1, 10, 0, 0),
                createdBy=1,
                comments=[]
            )
        ]
    
    return ActivitiesSuccess(activities=sample_activities)

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
                        userId=comment["user_id"],
                        content=comment["content"],
                        createdAt=datetime.fromisoformat(comment.get("created_at") or comment.get("createdAt", datetime.now().isoformat()))
                    )
                    for comment in data.get("comments",[])
                ]

                activity_obj = Activity(
                    id=data["id"],
                    courseId=data["course_id"],
                    title=data["title"],
                    description=data.get("description"),
                    activityType=TypeActivity(data["activity_type"]),
                    dueDate=datetime.fromisoformat(data["due_date"]) if data.get("due_date") else None,
                    fileUrl=data.get("file_url"),
                    createdAt=datetime.fromisoformat(data.get("created_at", datetime.now().isoformat())),
                    createdBy=data["created_by"],
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
                    # Si no hay conexión con el servicio, devolver datos de muestra
                    return _get_sample_activities(id_course)
                
                data = response.json()
                activities_data = data.get("activities", [])
                activities_list = []
                for activity in activities_data:

                    due_date_str = activity.get("due_date")
                    created_at_str = activity.get("created_at")  # Corregido: snake_case
            
                    due_date = datetime.fromisoformat(due_date_str.replace("Z", "+00:00")) if due_date_str else None
                    createdAt = datetime.fromisoformat(created_at_str) if created_at_str else datetime.now()

                    # Mapear de snake_case a camelCase
                    activity_instance = Activity(
                        id=activity["id"],
                        courseId=activity["course_id"],
                        title=activity["title"],
                        description=activity.get("description"),
                        activityType=TypeActivity(activity["activity_type"]),
                        dueDate=due_date,
                        fileUrl=activity.get("file_url"),
                        createdAt=createdAt,
                        createdBy=activity["created_by"],
                        comments=[]
                    )
                    activities_list.append(activity_instance)

                return ActivitiesSuccess(activities = activities_list)

        except Exception as e:
            print(f"❌ Error connecting to activities service: {str(e)}")
            # Si hay error de conexión, devolver datos de muestra
            return _get_sample_activities(id_course)
    
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

                    #Mapeo de la calificación si existe
                    latest_grade_data = submission.get("latest_grade")
                    latest_grade = None
                    if latest_grade_data:
                        latest_grade = gradeSubmission(
                            id=latest_grade_data["id"],
                            gradedBy=latest_grade_data["graded_by"],
                            gradedAt=datetime.fromisoformat(latest_grade_data["graded_at"].replace("Z", "+00:00"))
                                if latest_grade_data.get("graded_at") else None,
                            score=latest_grade_data["score"],
                            feedback=latest_grade_data.get("feedback")
                        )

                    # Mapear de snake_case a camelCase
                    submission_instance = Submissions(
                        id=submission["id"],
                        activityId=submission["activity_id"],
                        submittedAt=submitted_at,
                        content=submission.get("content"),
                        fileUrl=submission.get("file_url"),
                        additionalFiles=submission.get("additional_files"),
                        isGraded=submission["is_graded"],
                        canEdit=submission["can_edit"],
                        latestGrade=latest_grade
                    )
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
            return SubmissionsErrorList(message=str(error_msg), code="500")
            #return SubmissionsErrorList(message="Error interno en el servidor", code="500")

        

@strawberry.type
class Mutation: 
    @strawberry.mutation
    async def createActivity(
        self, 
        info,
        courseId: int,
        title: str,
        activityType: TypeActivity,
        description: Optional[str] = None,
        dueDate: Optional[datetime] = None,
        fileUrl: Optional[str] = None

    ) -> ActivityResult:
        """
        Registra un nueva actividad en el sistema.

        Args:
            courseId (int): Identificador del curso
            title (str): Titulo de la actividad
            activityType (TypeActivity): Tipo de actividad
            description (Optional[str]): Descripcion de la actividad
            dueDate: (Optional[Datetime]): Fecha limite de entrega
            fileUrl (Optional[str]): Url del archivo

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
                    "course_id": courseId,
                    "title": title,
                    "description": description,
                    "activity_type": activityType.value,  
                    "due_date": dueDate.isoformat() if dueDate else None,
                    "file_url": fileUrl
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
                    courseId=activity_data["course_id"],
                    title=activity_data["title"],
                    description=activity_data.get("description"),
                    activityType=TypeActivity(activity_data["activity_type"]),
                    dueDate=datetime.fromisoformat(activity_data["due_date"].replace("Z", "+00:00"))
                        if activity_data.get("due_date") else None,
                    fileUrl=activity_data.get("file_url"),
                    createdAt=datetime.fromisoformat(activity_data["created_at"].replace("Z", "+00:00")),
                    createdBy=activity_data["created_by"]
                )
                return ActivitySuccess(activity = created_activity)
        except Exception as e: 
            print("❌ Error al crear la actividad:", str(e))
            return ActivityError(message="Error al registrar la actividad", code="500")

    @strawberry.mutation
    async def updateActivity(
        self,
        info,
        id: str,
        title: Optional[str] = None,
        description: Optional[str] = None,
        activityType: Optional[TypeActivity] = None,
        dueDate: Optional[datetime] = None,
        fileUrl: Optional[str] = None
    ) -> ActivityResult:
        """
        Actualiza una actividad existente.

        Args:
            id (str): Identificador de la actividad
            title (Optional[str]): Nuevo título de la actividad
            description (Optional[str]): Nueva descripción de la actividad
            activityType (Optional[TypeActivity]): Nuevo tipo de actividad
            dueDate (Optional[datetime]): Nueva fecha límite de entrega
            fileUrl (Optional[str]): Nueva URL del archivo

        Returns:
            ActivityResult: Resultado de la actualización
        """
        # Obtener el token desde el header
        request = info.context["request"]
        auth_header = request.headers.get("authorization")
        token = None

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            token = request.cookies.get("auth_token")

        if not token:
            return ActivityError(message="Token no proporcionado", code="401")
        
        # Verificar el token
        try: 
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{AUTH_SERVICE_URL}/auth/me",
                    headers={"Authorization": f"Bearer {token}"},
                )

                if response.status_code != 200:
                    return ActivityError(message="Token inválido o expirado", code="401")
                user_data = response.json()
        except Exception as e: 
            print("❌ Error en la verificación del token:", str(e))
            return ActivityError(message="Error al verificar el token", code="401")

        # Actualizar la actividad en el microservicio
        try: 
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Preparar payload solo con campos que no son None
                activity_payload = {}
                if title is not None:
                    activity_payload["title"] = title
                if description is not None:
                    activity_payload["description"] = description
                if activityType is not None:
                    activity_payload["activity_type"] = activityType.value
                if dueDate is not None:
                    activity_payload["due_date"] = dueDate.isoformat()
                if fileUrl is not None:
                    activity_payload["file_url"] = fileUrl

                activity_response = await client.put(
                    f"{ACTIVITIES_SERVICE_URL}/api/activities/{id}",
                    json=activity_payload,
                    headers={"User_id": str(user_data["id"])}
                )

                if activity_response.status_code != 200: 
                    error_data = activity_response.json()
                    error_detail = "Error al actualizar la actividad"
                    error_code = "UPDATE_ERROR"

                    if "detail" in error_data:
                        if isinstance(error_data["detail"], dict):
                            error_detail = error_data["detail"].get("message", error_detail)
                            error_code = error_data["detail"].get("code", error_code)
                        else:
                            error_detail = error_data["detail"]
                    return ActivityError(message=error_detail, code=error_code)

                activity_data = activity_response.json()
                updated_activity = Activity(
                    id=activity_data["id"],
                    courseId=activity_data["course_id"],
                    title=activity_data["title"],
                    description=activity_data.get("description"),
                    activityType=TypeActivity(activity_data["activity_type"]),
                    dueDate=datetime.fromisoformat(activity_data["due_date"].replace("Z", "+00:00"))
                        if activity_data.get("due_date") else None,
                    fileUrl=activity_data.get("file_url"),
                    createdAt=datetime.fromisoformat(activity_data["created_at"].replace("Z", "+00:00")),
                    createdBy=activity_data["created_by"]
                )
                return ActivitySuccess(activity=updated_activity)
        except Exception as e: 
            print("❌ Error al actualizar la actividad:", str(e))
            return ActivityError(message="Error al actualizar la actividad", code="500")
        
    @strawberry.mutation
    async def createSubmissions(
        self,
        info,
        activityId: int,
        content: Optional[str] = None,
        fileUrl: Optional[str] = None,
        additionalFiles: Optional[List[str]] = None
    ) -> SubmissionResult:
        """
        Registra una submission o envio por parte de un estudiante.

        Args:
            activityId (int): Identificador de la actividad
            content (str): Contenido del envio o la submision
            fileUrl (Optional[str]): Url del archivo
            additionalFiles (Optional[List[str]]): Lista de archivos adicionales

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
                    "activity_id": activityId,
                    "content": content,
                    "file_url": fileUrl,
                    "additional_files": additionalFiles
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
                    activityId = submission_data["activity_id"],
                    submittedAt = datetime.fromisoformat(submission_data["submitted_at"].replace("Z", "+00:00"))
                        if submission_data.get("submitted_at") else None,
                    content = submission_data["content"],
                    fileUrl = submission_data["file_url"],
                    additionalFiles = submission_data["additional_files"],
                    isGraded = submission_data["is_graded"],
                    canEdit = submission_data["can_edit"],
                    latestGrade = submission_data["latest_grade"]
                )

                return SubmissionsSuccess(submission = created_submission)

        except Exception as e: 
            print("❌ Error al crear la submision:", str(e))
            return SubmissionsError(message="Error al registrar la Submision", code="500")
    

    @strawberry.mutation
    async def updateSubmission(
        self,
        info,
        submissionId: int,
        content: Optional[str] = None,
        fileUrl: Optional[str] = None,
        additionalFiles: Optional[List[str]] = None
    ) -> SubmissionResult:
        """
        Actualiza una submission o envio por parte de un estudiante.

        Args:
            submissionId (int): Identificador de la submission
            content (str): Contenido del envio o la submision
            fileUrl (Optional[str]): Url del archivo
            additionalFiles (Optional[List[str]]): Lista de archivos adicionales

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
                    "file_url": fileUrl,
                    "additional_files": additionalFiles
                }

                submission_response = await client.put(
                    f"{ACTIVITIES_SERVICE_URL}/api/submissions/{submissionId}",
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
                    activityId = submission_data["activity_id"],
                    submittedAt = datetime.fromisoformat(submission_data["submitted_at"].replace("Z", "+00:00"))
                        if submission_data.get("submitted_at") else None,
                    content = submission_data["content"],
                    fileUrl = submission_data["file_url"],
                    additionalFiles = submission_data["additional_files"],
                    isGraded = submission_data["is_graded"],
                    canEdit = submission_data["can_edit"],
                    latestGrade = submission_data["latest_grade"]
                )

                return SubmissionsSuccess(submission=updated_submission)

        except Exception as e: 
            print("❌ Problemas en el servidor:", str(e))
            return SubmissionsError(message = "Error en el servidor", code = "500")
        
    @strawberry.mutation
    async def gradeSubmission(
        self,
        info,
        score: float,
        submissionId: int,
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

                # Mejorar la lógica para determinar el rol del usuario
                # Si es superuser, es TEACHER, si no, necesitamos verificar el rol
                user_role = "TEACHER" if user_data.get("is_superuser", False) else "TEACHER"  # Por ahora asumimos TEACHER para todos

                grade_response = await client.post(
                    f"{ACTIVITIES_SERVICE_URL}/api/submissions/{submissionId}/grade",
                    params={"user_role": user_role},
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
                    submissionId = grade_data['submission_id'],
                    gradedBy = grade_data['graded_by'],
                    gradedAt = datetime.fromisoformat(grade_data["graded_at"].replace("Z", "+00:00"))
                        if grade_data.get("graded_at") else None,
                    score = grade_data['score'],
                    feedback = grade_data['feedback'],
                    scorePercentage = grade_data['score_percentage']
                )


                return GradeSuccess(grades=grade)
        except Exception as e:
            print("❌ Problemas en el servidor:", str(e))
            return GradeError(message="Error en el servidor", code="500")
    
    @strawberry.mutation
    async def submitAssignment(
        self,
        info,
        activityId: str,
        studentId: str,
        fileUrl: str,
        comments: Optional[str] = None
    ) -> SubmissionResult:
        """
        Permite a un estudiante entregar una tarea.
        
        Parameters:
            activityId: ID de la actividad
            studentId: ID del estudiante
            fileUrl: URL del archivo entregado
            comments: Comentarios opcionales del estudiante
            
        Returns:
            SubmissionResult: Resultado de la entrega
        """
        try:
            request = info.context["request"]
            
            # Obtener el token de autenticación (mismo patrón que auth.py)
            auth_header = request.headers.get("authorization")
            token = None

            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
            else:
                # Si no hay header Authorization, intentar obtener desde cookies
                token = request.cookies.get("auth_token")

            if not token:
                return SubmissionsError(message="No autenticado", code="UNAUTHORIZED")
            
            # Verificar el usuario actual consultando el servicio de auth
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    auth_response = await client.get(
                        f"{AUTH_SERVICE_URL}/auth/me",
                        headers={"Authorization": f"Bearer {token}"},
                    )

                    if auth_response.status_code != 200:
                        return SubmissionsError(message="Token inválido", code="UNAUTHORIZED")

                    user_data = auth_response.json()
                    user_id = str(user_data.get("id"))
                    user_role = "ADMIN" if user_data.get("is_superuser") else "STUDENT"
            except Exception:
                return SubmissionsError(message="Error al verificar autenticación", code="AUTH_ERROR")
            
            # Verificar que el usuario sea estudiante o sea el mismo usuario
            if user_role != "STUDENT" and user_id != studentId:
                return SubmissionsError(message="No autorizado para entregar esta tarea", code="FORBIDDEN")
            
            # Realizar la entrega
            async with httpx.AsyncClient(timeout=30.0) as client:
                payload = {
                    "activity_id": int(activityId),
                    "content": comments,
                    "file_url": fileUrl
                }
                
                response = await client.post(
                    f"{ACTIVITIES_SERVICE_URL}/api/submissions/",
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {token}",
                        "User_id": str(user_id)
                    }
                )
                
                if response.status_code not in [200, 201]:
                    error_data = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}
                    return SubmissionsError(
                        message=error_data.get("message", "Error al crear la entrega"),
                        code=f"HTTP_{response.status_code}"
                    )
                    
                data = response.json()
                
                # Mapear la respuesta a nuestro esquema
                submission = Submissions(
                    id=data["id"],
                    activityId=data["activity_id"],
                    submittedAt=datetime.fromisoformat(data["submitted_at"]) if data.get("submitted_at") else None,
                    content=data.get("content"),
                    fileUrl=data.get("file_url"),
                    additionalFiles=data.get("additional_files", []),
                    isGraded=data.get("is_graded", False),
                    canEdit=data.get("can_edit", True),
                    latestGrade=None  # Se puede expandir más tarde
                )
                
                return SubmissionsSuccess(submission=submission)
                
        except httpx.TimeoutException:
            return SubmissionsError(message="Timeout al contactar el servicio de actividades", code="TIMEOUT")
        except httpx.RequestError as e:
            return SubmissionsError(message=f"Error de conexión: {str(e)}", code="CONNECTION_ERROR")
        except Exception as e:
            return SubmissionsError(message=f"Error interno: {str(e)}", code="INTERNAL_ERROR")
    
    @strawberry.mutation
    async def createComment(
        self,
        info,
        activityId: str,
        content: str
    ) -> CommentResult:
        """
        Crea un comentario en una actividad.

        Args:
            activity_id (str): Identificador de la actividad
            content (str): Contenido del comentario

        Returns:
            Activity Resultado de la actividad actualizada

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
            return CommentError(message = "Token no proporcionado", code = "401")
        
        #Verifica el token
        try: 
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{AUTH_SERVICE_URL}/auth/me",
                    headers={"Authorization": f"Bearer {token}"},
                )

                if response.status_code != 200:
                    return CommentError(message = "Token invalido o expirado", code = "401")
                user_data = response.json()
        except Exception as e: 
            print("❌ Error in la verificación del token :", str(e))
            return CommentError(message = "Error al verificar el token ", code = "401")
        
        #Creación del comentario en la actividad
        try: 
            async with httpx.AsyncClient(timeout=10.0) as client:
                comment_payload = {
                    "content": content
                }
                comment_response = await client.post(
                    f"{ACTIVITIES_SERVICE_URL}/api/activities/{activityId}/comments",
                    json = comment_payload,
                    headers={"User_id": str(user_data["id"])}
                )

                if comment_response.status_code != 201:
                    error_data = comment_response.json()
                    error_detail = "Credenciales inválidas"
                    error_code = "Problemas en el servidor"

                    if "detail" in error_data:
                        if isinstance(error_data["detail"], dict):
                            error_detail = error_data["detail"].get(
                                "message", error_detail
                            )
                            error_code = error_data["detail"].get("code", error_code)
                        else:
                            error_detail = error_data["detail"]
                    return CommentError(message=error_detail, code=error_code)
                
                comment_data = comment_response.json()
                comment = CommentSuccess(
                    id=comment_data["id"],
                    activityId=comment_data["activity_id"],
                    content=comment_data["content"],
                    createdAt=datetime.fromisoformat(comment_data["created_at"].replace("Z", "+00:00"))
                        if comment_data.get("created_at") else None
                )

                return comment
        except httpx.HTTPStatusError as e:
            print("❌ Error al crear el comentario:", str(e))
            return CommentError(message="Error al registrar el comentario", code="500")

        



    
    
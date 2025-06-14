"""
Módulo de Resolvers de Cursos para GraphQL

Este módulo implementa las operaciones relacionadas con cursos
del API Gateway de CourseClash utilizando GraphQL.
"""

import strawberry
from typing import List, Optional
from datetime import datetime
import httpx
import os

# Environment variables
COURSE_SERVICE_URL = os.getenv("COURSE_SERVICE_URL", "http://course_service:8003")


@strawberry.type
class Course:
    id: str
    title: str
    description: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None
    teacher_id: str
    status: str
    level: str
    category: str


@strawberry.type
class Query:
    @strawberry.field
    async def getCourse(self, id: str) -> Optional[Course]:
        """
        Obtiene un curso por su ID.
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{COURSE_SERVICE_URL}/courses/{id}")

                if response.status_code != 200:
                    return None

                course_data = response.json()
                return Course(**course_data)
        except Exception as e:
            print(f"Error getting course: {str(e)}")
            return None

    @strawberry.field
    async def getCourses(self) -> List[Course]:
        """
        Obtiene todos los cursos disponibles.
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{COURSE_SERVICE_URL}/courses")

                if response.status_code != 200:
                    return []

                courses_data = response.json()
                return [Course(**course) for course in courses_data]
        except Exception as e:
            print(f"Error getting courses: {str(e)}")
            return []

    @strawberry.field
    async def getUserCourses(self, userId: str) -> List[Course]:
        """
        Obtiene los cursos de un usuario específico.
        Por ahora, devuelve los cursos donde el usuario es teacher o está inscrito.
        """
        try:
            # Primero intentar obtener cursos del servicio específico
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{COURSE_SERVICE_URL}/users/{userId}/courses")

                if response.status_code == 200:
                    courses_data = response.json()
                    return [Course(**course) for course in courses_data]
                
                # Fallback: obtener todos los cursos y filtrar por teacher_id
                response = await client.get(f"{COURSE_SERVICE_URL}/courses")
                if response.status_code == 200:
                    courses_data = response.json()
                    user_courses = [course for course in courses_data if course.get('teacher_id') == userId]
                    return [Course(**course) for course in user_courses]
                
                return []
        except Exception as e:
            print(f"Error getting user courses: {str(e)}")
            # En caso de error, devolver una lista vacía pero con algunos cursos mock si es desarrollo
            if os.getenv("NODE_ENV") == "development":
                return [
                    Course(
                        id="1",
                        title="Matemáticas Discretas",
                        description="Curso introductorio de matemáticas discretas",
                        created_at="2024-01-01T00:00:00Z",
                        updated_at="2024-01-01T00:00:00Z",
                        teacher_id=userId,
                        status="active",
                        level="BEGINNER",
                        category="MATHEMATICS"
                    ),
                    Course(
                        id="2",
                        title="Paradigmas de Programación",
                        description="Exploración de diferentes paradigmas de programación",
                        created_at="2024-01-02T00:00:00Z",
                        updated_at="2024-01-02T00:00:00Z",
                        teacher_id=userId,
                        status="active",
                        level="INTERMEDIATE",
                        category="PROGRAMMING"
                    )
                ]
            return []


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def createCourse(
        self,
        info,
        title: str,
        description: Optional[str] = None,
        level: str = "BEGINNER",
        category: str = "GENERAL",
    ) -> Optional[Course]:
        """
        Crea un nuevo curso.
        """
        try:
            auth_header = info.context["request"].headers.get("authorization")
            if not auth_header:
                return None

            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{COURSE_SERVICE_URL}/courses",
                    json={
                        "title": title,
                        "description": description,
                        "level": level,
                        "category": category,
                    },
                    headers={"Authorization": auth_header},
                )

                if response.status_code != 201:
                    return None

                course_data = response.json()
                return Course(**course_data)
        except Exception as e:
            print(f"Error creating course: {str(e)}")
            return None

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
COURSE_SERVICE_URL = os.getenv("COURSE_SERVICE_URL", "http://cc_courses_ms:8001")


@strawberry.type
class Course:
    id: str
    title: str
    description: Optional[str] = None
    created_at: str
    creator_id: str
    is_active: bool


@strawberry.type
class Query:
    @strawberry.field
    async def getCourse(self, id: str) -> Optional[Course]:
        """
        Obtiene un curso por su ID.
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{COURSE_SERVICE_URL}/api/courses/{id}")
                print(response.json()['course'])

                if response.status_code != 200:
                    return "Error de consulta"

                course_data = response.json()['course']
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
                response = await client.get(f"{COURSE_SERVICE_URL}/api/courses")

                if response.status_code != 200:
                    return []

                courses_data = response.json()
                return [Course(**course) for course in courses_data]
        except Exception as e:
            print(f"Error getting courses: {str(e)}")
            return []


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def createCourse(
        self,
        info,
        title: str,
        description: str,
        creator_id: str
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
                        "creator_id": creator_id
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

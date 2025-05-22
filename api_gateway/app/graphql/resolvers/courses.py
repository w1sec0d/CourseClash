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

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Environment variables
COURSE_SERVICE_URL = os.getenv("COURSE_SERVICE_URL", "http://course_service:8001")



@strawberry.type
class Course:
    id: int
    title: str
    description: Optional[str] = None
    creator_id: int
    created_at : str
    is_active: int
    creator_name: str

def transform_course_data(course: dict) -> Course:
    return Course(
        id = course.get("id"),
        title = course.get("title"),
        description = course.get("description"),
        creator_id = course.get("creator_id"),
        created_at = course.get("created_at"),
        is_active =  course.get("is_active"),
        creator_name = course.get("creator_name")
    )

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
                couse_data_all = [transform_course_data(course) for course in course_data]
                return couse_data_all
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
                print(COURSE_SERVICE_URL)
                response = await client.get(f"{COURSE_SERVICE_URL}/courses/")

                if response.status_code != 200:
                    logger.error(f"Error getting courses, status code: {response.status_code}")
                    return []

                courses_data = response.json()
                
                return [transform_course_data(course) for course in courses_data]
        except Exception as e:
            logger.exception(f"Error getting courses: {str(e)}")
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

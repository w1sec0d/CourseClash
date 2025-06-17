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

# Datos de muestra para cursos
SAMPLE_COURSES = [
    {
        "id": "1",
        "title": "Matemáticas Avanzadas",
        "description": "Curso avanzado de matemáticas que incluye cálculo diferencial e integral, álgebra lineal y estadística aplicada.",
        "createdAt": "2024-01-15T09:00:00Z",
        "updatedAt": "2024-01-20T14:30:00Z",
        "teacherId": "1",
        "status": "ACTIVE",
        "level": "ADVANCED",
        "category": "MATHEMATICS"
    },
    {
        "id": "2", 
        "title": "Programación en Python",
        "description": "Aprende programación desde cero con Python. Incluye estructuras de datos, algoritmos y desarrollo web.",
        "createdAt": "2024-01-10T08:00:00Z",
        "updatedAt": "2024-01-25T16:45:00Z",
        "teacherId": "2",
        "status": "ACTIVE",
        "level": "BEGINNER",
        "category": "PROGRAMMING"
    },
    {
        "id": "3",
        "title": "Física Cuántica",
        "description": "Introducción a los conceptos fundamentales de la mecánica cuántica y sus aplicaciones modernas.",
        "createdAt": "2024-01-05T10:30:00Z", 
        "updatedAt": "2024-01-18T11:15:00Z",
        "teacherId": "1",
        "status": "ACTIVE",
        "level": "ADVANCED",
        "category": "PHYSICS"
    },
    {
        "id": "4",
        "title": "Historia del Arte",
        "description": "Recorrido por los principales movimientos artísticos desde el Renacimiento hasta el arte contemporáneo.",
        "createdAt": "2024-01-12T13:20:00Z",
        "updatedAt": "2024-01-22T09:10:00Z", 
        "teacherId": "3",
        "status": "ACTIVE",
        "level": "INTERMEDIATE",
        "category": "ARTS"
    }
]


@strawberry.type
class Course:
    id: str
    title: str
    description: Optional[str] = None
    createdAt: str
    updatedAt: Optional[str] = None
    teacherId: str
    status: str
    level: str
    category: str

    def __init__(self, **kwargs):
        self.id = kwargs.get("id", "")
        self.title = kwargs.get("title", "")
        self.description = kwargs.get("description")
        self.createdAt = kwargs.get("createdAt", "")
        self.updatedAt = kwargs.get("updatedAt")
        self.teacherId = kwargs.get("teacherId", "")
        self.status = kwargs.get("status", "")
        self.level = kwargs.get("level", "")
        self.category = kwargs.get("category", "")


@strawberry.type
class Query:
    @strawberry.field
    async def getCourse(self, id: str) -> Optional[Course]:
        """
        Obtiene un curso por su ID.
        """
        # Buscar en datos mockeados
        for course_data in SAMPLE_COURSES:
            if course_data["id"] == id:
                # Crear manualmente para evitar problemas de kwargs
                return Course(
                    id=course_data["id"],
                    title=course_data["title"],
                    description=course_data.get("description"),
                    createdAt=course_data["createdAt"],
                    updatedAt=course_data.get("updatedAt"),
                    teacherId=course_data["teacherId"],
                    status=course_data["status"],
                    level=course_data["level"],
                    category=course_data["category"]
                )
        return None

    @strawberry.field
    async def getCourses(self) -> List[Course]:
        """
        Obtiene todos los cursos disponibles.
        """
        # Crear lista manualmente para evitar problemas de kwargs
        courses = []
        for course_data in SAMPLE_COURSES:
            course = Course(
                id=course_data["id"],
                title=course_data["title"],
                description=course_data.get("description"),
                createdAt=course_data["createdAt"],
                updatedAt=course_data.get("updatedAt"),
                teacherId=course_data["teacherId"],
                status=course_data["status"],
                level=course_data["level"],
                category=course_data["category"]
            )
            courses.append(course)
        return courses


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
        Crea un nuevo curso (simulado).
        """
        # Crear nuevo curso con ID incremental
        new_id = str(len(SAMPLE_COURSES) + 1)
        current_time = datetime.now().isoformat() + "Z"
        
        new_course_data = {
            "id": new_id,
            "title": title,
            "description": description,
            "createdAt": current_time,
            "updatedAt": current_time,
            "teacherId": "1",  # ID del profesor por defecto
            "status": "ACTIVE",
            "level": level,
            "category": category,
        }
        
        # Agregar a la lista de cursos (en memoria)
        SAMPLE_COURSES.append(new_course_data)
        
        # Crear curso manualmente
        return Course(
            id=new_course_data["id"],
            title=new_course_data["title"],
            description=new_course_data.get("description"),
            createdAt=new_course_data["createdAt"],
            updatedAt=new_course_data.get("updatedAt"),
            teacherId=new_course_data["teacherId"],
            status=new_course_data["status"],
            level=new_course_data["level"],
            category=new_course_data["category"]
        )

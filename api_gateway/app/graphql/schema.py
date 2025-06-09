"""
Definición del esquema GraphQL para CourseClash API Gateway

Este archivo define la estructura de la API GraphQL, incluyendo:
- Tipos de datos (Queries y Mutations)
- Resolvers (funciones que resuelven los campos)
- La configuración del esquema principal

El esquema sigue la arquitectura modular, donde los resolvers
se organizan en módulos por dominio (auth, cursos, duelos, etc.).
"""

import strawberry
from typing import List, Optional
from datetime import datetime
import httpx

# Importamos los resolvers
from app.graphql.resolvers.auth import Query as AuthQuery, Mutation as AuthMutation
from app.graphql.resolvers.courses import (
    Query as CourseQuery,
    Mutation as CourseMutation,
)
from app.graphql.resolvers.duels import Query as DuelQuery, Mutation as DuelMutation
from app.graphql.resolvers.activities import Mutation as ActivitiesMutation


# Definición de la Query raíz
@strawberry.type
class Query(AuthQuery, CourseQuery, DuelQuery):
    """
    Punto de entrada para todas las consultas (queries) GraphQL.

    Combina las queries de todos los módulos:
    - Autenticación
    - Cursos
    - Duelos
    """

    pass


# Definición de la Mutation raíz
@strawberry.type
class Mutation(AuthMutation, CourseMutation, DuelMutation, ActivitiesMutation):
    """
    Punto de entrada para todas las mutaciones GraphQL.

    Combina las mutaciones de todos los módulos:
    - Autenticación
    - Cursos
    - Duelos
    """

    pass


# Creación del esquema GraphQL
schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
)

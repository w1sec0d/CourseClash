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

# Importamos los resolvers de autenticación
from app.graphql.resolvers.auth import Query as AuthQuery, Mutation as AuthMutation


# Definición de la Query raíz
# Hereda de AuthQuery, que contiene las consultas de autenticación
@strawberry.type
class Query(AuthQuery):
    """
    Punto de entrada para todas las consultas (queries) GraphQL.

    Aquí se combinan las queries de todos los módulos.
    Por ahora solo incluye las queries de autenticación.
    """

    pass


# Definición de la Mutation raíz
# Hereda de AuthMutation, que contiene las mutaciones de autenticación
@strawberry.type
class Mutation(AuthMutation):
    """
    Punto de entrada para todas las mutaciones GraphQL.

    Aquí se combinan las mutaciones de todos los módulos.
    Por ahora solo incluye las mutaciones de autenticación.
    """

    pass


# Creación del esquema GraphQL
# Combina las definiciones de Query y Mutation
schema = strawberry.Schema(
    query=Query,  # Especifica la Query raíz
    mutation=Mutation,  # Especifica la Mutation raíz
)

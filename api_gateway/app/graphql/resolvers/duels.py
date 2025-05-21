"""
Módulo de Resolvers de Duelos para GraphQL

Este módulo implementa las operaciones relacionadas con duelos
del API Gateway de CourseClash utilizando GraphQL.
"""

import strawberry
from typing import List, Optional
from datetime import datetime
import httpx
import os

# Environment variables
DUEL_SERVICE_URL = os.getenv("DUEL_SERVICE_URL", "http://duel_service:8002")


@strawberry.type
class Duel:
    id: str
    title: str
    description: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None
    status: str
    creator_id: str
    opponent_id: Optional[str] = None


@strawberry.type
class Query:
    @strawberry.field
    async def getDuel(self, id: str) -> Optional[Duel]:
        """
        Obtiene un duelo por su ID.
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{DUEL_SERVICE_URL}/duels/{id}")

                if response.status_code != 200:
                    return None

                duel_data = response.json()
                return Duel(**duel_data)
        except Exception as e:
            print(f"Error getting duel: {str(e)}")
            return None

    @strawberry.field
    async def getDuels(self) -> List[Duel]:
        """
        Obtiene todos los duelos disponibles.
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{DUEL_SERVICE_URL}/duels")

                if response.status_code != 200:
                    return []

                duels_data = response.json()
                return [Duel(**duel) for duel in duels_data]
        except Exception as e:
            print(f"Error getting duels: {str(e)}")
            return []


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def createDuel(
        self,
        title: str,
        info,
        description: Optional[str] = None,
        opponent_id: Optional[str] = None,
    ) -> Optional[Duel]:
        """
        Crea un nuevo duelo.
        """
        try:
            auth_header = info.context["request"].headers.get("authorization")
            if not auth_header:
                return None

            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{DUEL_SERVICE_URL}/duels",
                    json={
                        "title": title,
                        "description": description,
                        "opponent_id": opponent_id,
                    },
                    headers={"Authorization": auth_header},
                )

                if response.status_code != 201:
                    return None

                duel_data = response.json()
                return Duel(**duel_data)
        except Exception as e:
            print(f"Error creating duel: {str(e)}")
            return None

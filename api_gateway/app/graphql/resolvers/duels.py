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

from app.graphql.types.duel import (
    PlayerData,
    RequestDuelResponse,
    AcceptDuelResponse,
    ErrorResponse,
    RequestDuelInput,
    AcceptDuelInput,
)

# Environment variables
DUEL_SERVICE_URL = os.getenv("DUEL_SERVICE_URL", "http://duel_service:8002")
print(f"DUEL_SERVICE_URL: {DUEL_SERVICE_URL}")


@strawberry.type
class Query:
    @strawberry.field
    async def get_player(self, player_id: str) -> PlayerData:
        """Obtiene la información de un jugador por su ID"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{DUEL_SERVICE_URL}/api/players/{player_id}")
            if response.status_code == 200:
                return PlayerData(**response.json())
            raise Exception(f"Error getting player data: {response.text}")


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def request_duel(self, input: RequestDuelInput) -> RequestDuelResponse:
        """Solicita un nuevo duelo entre dos jugadores"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{DUEL_SERVICE_URL}/api/duels/request",
                json={
                    "requester_id": input.requesterId,
                    "opponent_id": input.opponentId,
                },
            )
            if response.status_code == 200:
                response_data = response.json()
                return RequestDuelResponse(
                    duelId=response_data["duel_id"], message=response_data["message"]
                )
            raise Exception(f"Error requesting duel: {response.text}")

    @strawberry.mutation
    async def accept_duel(self, input: AcceptDuelInput) -> AcceptDuelResponse:
        """Acepta un duelo existente"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{DUEL_SERVICE_URL}/api/duels/accept", json={"duel_id": input.duelId}
            )
            if response.status_code == 200:
                response_data = response.json()
                return AcceptDuelResponse(
                    duelId=response_data["duel_id"], message=response_data["message"]
                )
            raise Exception(f"Error accepting duel: {response.text}")

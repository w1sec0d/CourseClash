"""
GraphQL types for the Duel Service
"""

import strawberry
from typing import Optional


@strawberry.type
class PlayerData:
    playerId: str = strawberry.field(name="playerId")
    elo: int
    rank: str


@strawberry.type
class RequestDuelResponse:
    duelId: str = strawberry.field(name="duelId")
    message: str


@strawberry.type
class AcceptDuelResponse:
    duelId: str = strawberry.field(name="duelId")
    message: str


@strawberry.type
class Category:
    name: str
    displayName: str = strawberry.field(name="displayName")
    description: str


@strawberry.type
class ErrorResponse:
    error: str


@strawberry.input
class RequestDuelInput:
    requesterId: str = strawberry.field(name="requesterId")
    opponentId: str = strawberry.field(name="opponentId")
    category: str


@strawberry.input
class AcceptDuelInput:
    duelId: str = strawberry.field(name="duelId")

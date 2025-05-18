from fastapi import APIRouter, HTTPException, Depends, Header, Request, status
from typing import Optional
import httpx
import os

# Environment variables
DUEL_SERVICE_URL = os.getenv("DUEL_SERVICE_URL", "http://duel_service:8002")

router = APIRouter()

# Helper function to forward auth headers
def get_auth_headers(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return {"Authorization": authorization}

# Forward duel requests to duel service
@router.get("/")
async def get_duels(authorization: Optional[str] = Header(None)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{DUEL_SERVICE_URL}/api/duels",
            headers={"Authorization": authorization} if authorization else {}
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to fetch duels")
            )
            
        return response.json()

@router.get("/{duel_id}")
async def get_duel(duel_id: str, authorization: Optional[str] = Header(None)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{DUEL_SERVICE_URL}/api/duels/{duel_id}",
            headers={"Authorization": authorization} if authorization else {}
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Duel not found")
            )
            
        return response.json()

@router.post("/")
async def create_duel(request: Request, auth_headers: dict = Depends(get_auth_headers)):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{DUEL_SERVICE_URL}/api/duels",
            json=body,
            headers=auth_headers
        )
        
        if response.status_code != 201:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to create duel")
            )
            
        return response.json()

@router.put("/{duel_id}")
async def update_duel(duel_id: str, request: Request, auth_headers: dict = Depends(get_auth_headers)):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{DUEL_SERVICE_URL}/api/duels/{duel_id}",
            json=body,
            headers=auth_headers
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to update duel")
            )
            
        return response.json()

@router.post("/{duel_id}/join")
async def join_duel(duel_id: str, auth_headers: dict = Depends(get_auth_headers)):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{DUEL_SERVICE_URL}/api/duels/{duel_id}/join",
            headers=auth_headers
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to join duel")
            )
            
        return response.json()

@router.post("/{duel_id}/submit")
async def submit_answer(duel_id: str, request: Request, auth_headers: dict = Depends(get_auth_headers)):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{DUEL_SERVICE_URL}/api/duels/{duel_id}/submit",
            json=body,
            headers=auth_headers
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to submit answer")
            )
            
        return response.json()

@router.get("/leaderboard")
async def get_leaderboard(authorization: Optional[str] = Header(None)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{DUEL_SERVICE_URL}/api/duels/leaderboard",
            headers={"Authorization": authorization} if authorization else {}
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to fetch leaderboard")
            )
            
        return response.json()
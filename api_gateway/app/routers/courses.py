from fastapi import APIRouter, HTTPException, Depends, Header, Request, status
from typing import Optional
import httpx
import os

# Environment variables
COURSE_SERVICE_URL = os.getenv("COURSE_SERVICE_URL", "http://course_service:8001")

router = APIRouter()

# Helper function to forward auth headers
def get_auth_headers(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return {"Authorization": authorization}

# Forward course requests to course service
@router.get("/")
async def get_courses(authorization: Optional[str] = Header(None)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{COURSE_SERVICE_URL}/api/courses",
            headers={"Authorization": authorization} if authorization else {}
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to fetch courses")
            )
            
        return response.json()

@router.get("/{course_id}")
async def get_course(course_id: str, authorization: Optional[str] = Header(None)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{COURSE_SERVICE_URL}/api/courses/{course_id}",
            headers={"Authorization": authorization} if authorization else {}
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Course not found")
            )
            
        return response.json()

@router.post("/")
async def create_course(request: Request, auth_headers: dict = Depends(get_auth_headers)):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{COURSE_SERVICE_URL}/api/courses",
            json=body,
            headers=auth_headers
        )
        
        if response.status_code != 201:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to create course")
            )
            
        return response.json()

@router.put("/{course_id}")
async def update_course(course_id: str, request: Request, auth_headers: dict = Depends(get_auth_headers)):
    body = await request.json()
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{COURSE_SERVICE_URL}/api/courses/{course_id}",
            json=body,
            headers=auth_headers
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to update course")
            )
            
        return response.json()

@router.delete("/{course_id}")
async def delete_course(course_id: str, auth_headers: dict = Depends(get_auth_headers)):
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{COURSE_SERVICE_URL}/api/courses/{course_id}",
            headers=auth_headers
        )
        
        if response.status_code != 204:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to delete course")
            )
            
        return {"success": True}

# Activities endpoints
@router.get("/{course_id}/activities")
async def get_course_activities(course_id: str, authorization: Optional[str] = Header(None)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{COURSE_SERVICE_URL}/api/courses/{course_id}/activities",
            headers={"Authorization": authorization} if authorization else {}
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("detail", "Failed to fetch activities")
            )
            
        return response.json()
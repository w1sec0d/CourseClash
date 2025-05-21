from fastapi import APIRouter, HTTPException, Depends, Header, Request, status
from typing import Optional
import httpx
import os

# Environment variables
DUEL_SERVICE_URL = os.getenv("DUEL_SERVICE_URL", "http://duel_service:8002")

router = APIRouter()

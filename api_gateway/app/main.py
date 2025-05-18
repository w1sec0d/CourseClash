from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from strawberry.fastapi import GraphQLRouter
import httpx
import os

# Import routers
from app.routers import auth, courses, duels

# Import GraphQL schema
from app.graphql.schema import schema

# Create FastAPI app
app = FastAPI(
    title="CourseClash API Gateway",
    description="API Gateway for CourseClash platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GraphQL endpoint
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

# Include REST routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(duels.router, prefix="/api/duels", tags=["duels"])

@app.get("/", tags=["root"])
async def root():
    return {"message": "Welcome to CourseClash API Gateway"}

@app.get("/health", tags=["health"])
async def health():
    return {"status": "healthy"}

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )
from fastapi import Request, HTTPException, status
from app.utils.mock_db import verify_mock_token

async def verify_auth_token(request: Request):
    """
    Middleware function to verify JWT token in request headers
    """
    # Skip auth for certain paths
    if request.url.path.startswith(("/docs", "/openapi.json", "/redoc", "/health")):
        return
        
    # Skip auth for OPTIONS requests (CORS preflight)
    if request.method == "OPTIONS":
        return
        
    # Get auth header
    auth_header = request.headers.get("authorization")
    
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
        
    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
            
        user = verify_mock_token(token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
            
        # Attach user to request state for use in route handlers
        request.state.user = user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}"
        )

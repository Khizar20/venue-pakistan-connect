from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core.database import get_db, User
from app.utils.auth import create_access_token, hash_password
from app.schemas.user import UserResponse
from app.core.config import settings
import httpx
import urllib.parse

oauth_router = APIRouter(prefix="/auth/oauth", tags=["OAuth"])

@oauth_router.get("/google")
async def google_login(request: Request):
    """Initiate Google OAuth login"""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured"
        )
    
    # Generate state parameter for security
    import secrets
    state = secrets.token_urlsafe(32)
    
    # Store state in session
    request.session['oauth_state'] = state
    
    # Build Google OAuth URL
    params = {
        'client_id': settings.GOOGLE_CLIENT_ID,
        'redirect_uri': 'http://localhost:8000/auth/oauth/google/callback',
        'scope': 'openid email profile',
        'response_type': 'code',
        'state': state,
        'access_type': 'offline',
        'prompt': 'consent'
    }
    
    auth_url = f"https://accounts.google.com/o/oauth2/auth?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=auth_url, status_code=status.HTTP_302_FOUND)

@oauth_router.get("/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db),
    code: str = None,
    state: str = None,
    scope: str = None,
    authuser: str = None,
    prompt: str = None
):
    """Handle Google OAuth callback"""
    # Print all parameters received from Google
    print("🔍 Google OAuth Callback Parameters:")
    print(f"  code: {code}")
    print(f"  state: {state}")
    print(f"  scope: {scope}")
    print(f"  authuser: {authuser}")
    print(f"  prompt: {prompt}")
    
    # Also print all query parameters from request
    print("🔍 All query parameters:")
    for key, value in request.query_params.items():
        print(f"  {key}: {value}")
    
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured"
        )
    
    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authorization code not provided"
        )
    
    # Verify state parameter (optional for now)
    session_state = request.session.get('oauth_state')
    print(f"🔍 Session state: {session_state}")
    print(f"🔍 Received state: {state}")
    
    if session_state and state != session_state:
        print("⚠️ State mismatch, but continuing...")
        # Don't fail for now, just log the mismatch
    
    try:
        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                'https://oauth2.googleapis.com/token',
                data={
                    'client_id': settings.GOOGLE_CLIENT_ID,
                    'client_secret': settings.GOOGLE_CLIENT_SECRET,
                    'code': code,
                    'grant_type': 'authorization_code',
                    'redirect_uri': 'http://localhost:8000/auth/oauth/google/callback'
                }
            )
            token_data = token_response.json()
            
            if 'access_token' not in token_data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not get access token from Google"
                )
            
            access_token = token_data['access_token']
            
            # Get user info from Google
            user_response = await client.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            user_info = user_response.json()
        
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not get user info from Google"
            )
        
        email = user_info.get('email')
        name = user_info.get('name')
        google_id = user_info.get('id')
        profile_picture = user_info.get('picture')
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not provided by Google"
            )
        
        # Check if user exists by email or Google ID
        user = db.query(User).filter(
            (User.email == email) | (User.google_id == google_id)
        ).first()
        if user:
            print(f"✅ User found: {user.email}")
        if not user:
            # Create new user
            user = User(
                name=name or "Google User",
                email=email,
                google_id=google_id,
                is_verified=True,
                is_active=True,
                role="user"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"✅ Created new Google user: {email}")
        else:
            # Update existing user with Google ID and verification status
            if not user.google_id:
                user.google_id = google_id
            user.is_verified = True
            user.is_active = True
            if name and not user.name:
                user.name = name
            db.commit()
            print(f"✅ Updated existing user with Google info: {email}")
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        # Redirect to frontend with token
        return RedirectResponse(
            url=f"http://localhost:8080/dashboard?token={access_token}",
            status_code=status.HTTP_302_FOUND
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth error: {str(e)}"
        )

@oauth_router.get("/users")
async def get_users(db: Session = Depends(get_db)):
    """Get all users (for testing)"""
    users = db.query(User).all()
    return {
        "users": [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "google_id": user.google_id,
                "is_verified": user.is_verified,
                "is_active": user.is_active,
                "role": user.role,
                "created_at": user.created_at
            }
            for user in users
        ]
    }

from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
import time
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session
import uvicorn

from app.api.auth.routes import auth_router
from app.api.oauth.routes import oauth_router
from app.api.vendor.routes import vendor_router
from app.api.admin.routes import admin_router
from app.core.database import engine, Base, get_db
from app.core.config import settings
from app.utils.auth import get_current_admin

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: wait for DB to be ready, then create tables
    max_attempts = 30
    for attempt in range(1, max_attempts + 1):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            break
        except OperationalError:
            if attempt == max_attempts:
                raise
            time.sleep(2)
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Shadiejo Authentication API",
    description="FastAPI application with user authentication and OAuth",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add session middleware for OAuth
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# Mount static files (only if directory exists)
import os
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth_router)
app.include_router(oauth_router)
app.include_router(vendor_router)
app.include_router(admin_router)


# Removed HTML template routes - frontend handles all UI

@app.get("/venues")
async def get_all_venues(db: Session = Depends(get_db)):
    """Get all active venues for public viewing"""
    from app.core.database import Venue
    venues = db.query(Venue).filter(Venue.is_active == True).all()
    return venues

@app.get("/venues/{venue_id}")
async def get_venue_by_id(venue_id: int, db: Session = Depends(get_db)):
    """Get a specific venue by ID for public viewing"""
    from app.core.database import Venue
    venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.is_active == True
    ).first()
    
    if not venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found"
        )
    
    return venue

# Admin endpoints for database viewing
@app.get("/admin/users")
async def get_all_users(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Get all users for admin viewing"""
    from app.core.database import User
    users = db.query(User).all()
    return {
        "users": [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "is_verified": user.is_verified,
                "is_active": user.is_active,
                "google_id": user.google_id,
                "created_at": user.created_at.isoformat() if user.created_at else None
            }
            for user in users
        ]
    }

@app.get("/admin/pending")
async def get_pending_verifications(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Get all pending verifications for admin viewing"""
    from app.core.database import PendingVerification
    pending = db.query(PendingVerification).all()
    return {
        "pending": [
            {
                "id": p.id,
                "name": p.name,
                "email": p.email,
                "created_at": p.created_at.isoformat() if p.created_at else None,
                "expires_at": p.expires_at.isoformat() if p.expires_at else None
            }
            for p in pending
        ]
    }

@app.delete("/admin/users/{user_id}")
async def delete_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Delete a user by ID"""
    from app.core.database import User
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}, 404
    
    db.delete(user)
    db.commit()
    return {"message": f"User {user.email} deleted successfully"}

@app.delete("/admin/pending/{pending_id}")
async def delete_pending_verification(
    pending_id: int, 
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Delete a pending verification by ID"""
    from app.core.database import PendingVerification
    pending = db.query(PendingVerification).filter(PendingVerification.id == pending_id).first()
    if not pending:
        return {"error": "Pending verification not found"}, 404
    
    db.delete(pending)
    db.commit()
    return {"message": f"Pending verification for {pending.email} deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

#!/usr/bin/env python3
"""
Database Viewer - Simple web interface to view PostgreSQL data
"""

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from database import engine, User
from sqlalchemy.orm import sessionmaker
import uvicorn

app = FastAPI(title="Database Viewer")
templates = Jinja2Templates(directory="templates")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@app.get("/", response_class=HTMLResponse)
async def view_database(request: Request):
    """View all users in the database"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        return templates.TemplateResponse("db_viewer.html", {
            "request": request,
            "users": users,
            "total_users": len(users)
        })
    finally:
        db.close()

@app.get("/api/users")
async def get_users_api():
    """API endpoint to get users as JSON"""
    db = SessionLocal()
    try:
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
                    "created_at": user.created_at.isoformat() if user.created_at else None
                }
                for user in users
            ],
            "total": len(users)
        }
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

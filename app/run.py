#!/usr/bin/env python3
"""
Startup script for Shadiejo FastAPI application
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    print("🚀 Starting Shadiejo FastAPI Application...")
    print("📱 Frontend: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔧 Admin Panel: http://localhost:8000/redoc")
    print("=" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

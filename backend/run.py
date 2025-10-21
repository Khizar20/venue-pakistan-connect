#!/usr/bin/env python3
"""
Startup script for Shadiejo FastAPI application
"""

import subprocess
import sys
import time
import os
import uvicorn
from app.main import app

def run_migrations():
    """Run database migrations"""
    try:
        print("🔄 Running database migrations...")
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        print("✅ Database migrations completed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Migration failed: {e}")
        sys.exit(1)

def wait_for_db():
    """Wait for database to be ready"""
    import psycopg2
    import time
    
    # Get database URL from environment
    database_url = os.getenv("DATABASE_URL", "postgresql://postgres:password@db:5432/shadiejo")
    
    # Simple wait with retries
    for i in range(10):
        try:
            conn = psycopg2.connect(database_url)
            conn.close()
            print("✅ Database is ready!")
            return
        except psycopg2.OperationalError:
            print(f"⏳ Waiting for database... ({i+1}/10)")
            time.sleep(3)
    
    print("❌ Database connection failed!")
    sys.exit(1)

if __name__ == "__main__":
    print("🚀 Starting Shadiejo FastAPI Application...")
    print("📱 Frontend: http://localhost:3000")
    print("🔧 Backend API: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔧 Admin Panel: http://localhost:8000/redoc")
    print("=" * 50)
    
    # Wait for database
    wait_for_db()
    
    # Run migrations
    run_migrations()
    
    # Start the application
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
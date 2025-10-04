#!/usr/bin/env python3
"""
Simple database connection checker
"""

from database import engine, SessionLocal, User
from sqlalchemy import text

print("🔍 Checking database connection...")
print(f"Database URL: {engine.url}")

try:
    # Test connection
    session = SessionLocal()
    print("✅ Database connection successful!")
    
    # Check users table
    result = session.execute(text("SELECT COUNT(*) FROM users"))
    count = result.scalar()
    print(f"📊 Users in database: {count}")
    
    # Show all users
    users = session.query(User).all()
    print(f"👥 Users found:")
    for user in users:
        print(f"  - ID: {user.id}, Name: {user.name}, Email: {user.email}, Google ID: {user.google_id}")
    
    session.close()
    
except Exception as e:
    print(f"❌ Error: {e}")

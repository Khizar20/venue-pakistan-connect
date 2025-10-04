#!/usr/bin/env python3
"""
Test database connection and user creation
"""

from database import engine, SessionLocal, User
from sqlalchemy import text
import traceback

def test_connection():
    try:
        # Test connection
        session = SessionLocal()
        print("✅ Database connection successful!")
        
        # Test query
        result = session.execute(text("SELECT 1"))
        print("✅ Database query successful!")
        
        # Check if users table exists
        result = session.execute(text("SELECT COUNT(*) FROM users"))
        count = result.scalar()
        print(f"✅ Users table exists with {count} users")
        
        # Try to create a test user
        test_user = User(
            name="Test User",
            email="test@example.com",
            is_verified=True,
            is_active=True,
            role="user"
        )
        session.add(test_user)
        session.commit()
        session.refresh(test_user)
        print(f"✅ Test user created with ID: {test_user.id}")
        
        # Clean up test user
        session.delete(test_user)
        session.commit()
        print("✅ Test user cleaned up")
        
        session.close()
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        print(f"❌ Traceback: {traceback.format_exc()}")
        return False

if __name__ == "__main__":
    test_connection()

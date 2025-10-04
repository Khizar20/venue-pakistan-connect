#!/usr/bin/env python3
"""
Test PostgreSQL Connection
"""

from database import engine, Base, User
from sqlalchemy.orm import sessionmaker

def test_connection():
    try:
        # Test connection
        connection = engine.connect()
        print("✅ PostgreSQL connection successful!")
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
        
        # Test inserting a user
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Check if users table exists and has data
        users = db.query(User).all()
        print(f"✅ Found {len(users)} users in database")
        
        for user in users:
            print(f"  - {user.name} ({user.email})")
        
        db.close()
        connection.close()
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\n🔧 Please run these commands manually:")
        print("1. sudo -u postgres psql")
        print("2. ALTER USER postgres PASSWORD 'password';")
        print("3. CREATE DATABASE shadiejo;")
        print("4. \\q")

if __name__ == "__main__":
    test_connection()

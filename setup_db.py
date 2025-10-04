#!/usr/bin/env python3
"""
PostgreSQL Database Setup Script
Run this to create the database and tables
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def setup_database():
    try:
        # Connect to PostgreSQL (using default postgres user)
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="password"  # Change this to your postgres password
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Create database
        cursor.execute("CREATE DATABASE shadiejo;")
        print("✅ Database 'shadiejo' created successfully")
        
        # Close connection
        cursor.close()
        conn.close()
        
        # Now create tables using SQLAlchemy
        from database import engine, Base
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully")
        
    except psycopg2.errors.DuplicateDatabase:
        print("✅ Database 'shadiejo' already exists")
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        print("\n🔧 Manual setup steps:")
        print("1. Connect to PostgreSQL: psql -U postgres")
        print("2. Create database: CREATE DATABASE shadiejo;")
        print("3. Create user: CREATE USER postgres WITH PASSWORD 'password';")
        print("4. Grant privileges: GRANT ALL PRIVILEGES ON DATABASE shadiejo TO postgres;")

if __name__ == "__main__":
    setup_database()

#!/usr/bin/env python3
"""
PostgreSQL Helper - Access database using Python instead of psql
"""

import psycopg2
from database import engine
from sqlalchemy import text

def connect_and_query():
    """Connect to PostgreSQL and run queries"""
    try:
        # Get connection string from your working setup
        connection_string = str(engine.url)
        print(f"🔗 Connecting to: {connection_string}")
        
        # Connect using psycopg2
        conn = psycopg2.connect(connection_string)
        cursor = conn.cursor()
        
        print("✅ Connected to PostgreSQL successfully!")
        
        # Show all tables
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
        tables = cursor.fetchall()
        print(f"\n📊 Tables in database:")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Show users table structure
        cursor.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';")
        columns = cursor.fetchall()
        print(f"\n🏗️ Users table structure:")
        for col in columns:
            print(f"  - {col[0]}: {col[1]}")
        
        # Show all users
        cursor.execute("SELECT * FROM users;")
        users = cursor.fetchall()
        print(f"\n👥 Users in database:")
        for user in users:
            print(f"  ID: {user[0]}, Name: {user[1]}, Email: {user[2]}, Google ID: {user[7]}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n🔧 Alternative: Use the web interface at http://localhost:8001/")

if __name__ == "__main__":
    connect_and_query()

#!/usr/bin/env python3
"""
Clean up unverified users from the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, User

def cleanup_unverified_users():
    """Remove all unverified users from the database"""
    db = SessionLocal()
    try:
        # Find all unverified users
        unverified_users = db.query(User).filter(User.is_verified == False).all()
        
        print(f"🔍 Found {len(unverified_users)} unverified users:")
        for user in unverified_users:
            print(f"  - {user.name} ({user.email}) - Created: {user.created_at}")
        
        if unverified_users:
            # Delete unverified users
            db.query(User).filter(User.is_verified == False).delete()
            db.commit()
            print(f"✅ Deleted {len(unverified_users)} unverified users")
        else:
            print("✅ No unverified users found")
        
        # Show remaining users
        remaining_users = db.query(User).all()
        print(f"\n📊 Remaining users: {len(remaining_users)}")
        for user in remaining_users:
            print(f"  - {user.name} ({user.email}) - Verified: {user.is_verified}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🧹 Cleaning up unverified users...")
    cleanup_unverified_users()
    print("✅ Cleanup completed!")

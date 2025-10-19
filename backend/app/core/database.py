from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from .config import settings

# Create database engine
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password = Column(String(255), nullable=True)  # Nullable for OAuth users
    role = Column(String(50), default="user")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)  # All users are verified since they're created after verification
    google_id = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pending email verification records stored to survive restarts
class PendingVerification(Base):
    __tablename__ = "pending_verifications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=False)
    cnic_number = Column(String(13), unique=True, nullable=False)  # 13 digit CNIC
    cnic_front_image = Column(String(5000000), nullable=True)  # Base64 encoded image
    cnic_back_image = Column(String(5000000), nullable=True)  # Base64 encoded image
    password = Column(String(255), nullable=True)  # For password-based auth
    is_active = Column(Boolean, default=False)  # Requires admin approval
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PendingVendorVerification(Base):
    __tablename__ = "pending_vendor_verifications"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=False)
    cnic_number = Column(String(13), nullable=False)
    cnic_front_image = Column(String(5000000), nullable=True)
    cnic_back_image = Column(String(5000000), nullable=True)
    password = Column(String(255), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Venue(Base):
    __tablename__ = "venues"
    
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    venue_type = Column(String(100), nullable=False)  # e.g., Wedding Hall, Garden, Conference
    city = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)
    capacity = Column(Integer, nullable=False)
    price_per_day = Column(Float, nullable=False)
    amenities = Column(Text, nullable=True)  # Comma-separated or JSON string
    images = Column(Text, nullable=True)  # JSON array of base64 images or URLs
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    vendor = relationship("Vendor", backref="venues")

# Note: Do NOT create tables here to avoid connecting to the DB during import time.
# Table creation is handled during application startup (see app/main.py lifespan).

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.core.database import get_db, Vendor, PendingVendorVerification, Venue
from app.utils.auth import hash_password, verify_password, create_access_token, get_current_vendor
from app.schemas.vendor import VendorCreate, VendorResponse, VendorLogin
from app.schemas.venue import VenueCreate, VenueResponse, VendorProfileUpdate
from app.utils.tokens import generate_verification_token, generate_verification_token_expiry, is_token_expired
from app.services.email import email_service
from typing import Optional, List
import base64
import os
import json
from datetime import datetime

vendor_router = APIRouter(prefix="/vendor", tags=["Vendor"])

@vendor_router.post("/signup")
async def vendor_signup(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    cnic_number: str = Form(...),
    password: str = Form(...),
    cnic_front_image: Optional[UploadFile] = File(None),
    cnic_back_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Register a new vendor with CNIC verification"""
    
    # Validate CNIC number format
    cleaned_cnic = cnic_number.replace('-', '').replace(' ', '')
    if len(cleaned_cnic) != 13 or not cleaned_cnic.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CNIC number must be exactly 13 digits"
        )
    
    # Check if vendor already exists
    existing_vendor = db.query(Vendor).filter(Vendor.email == email).first()
    if existing_vendor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered as vendor"
        )
    
    # Check if CNIC already exists
    existing_cnic = db.query(Vendor).filter(Vendor.cnic_number == cleaned_cnic).first()
    if existing_cnic:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CNIC number already registered"
        )
    
    # Handle image uploads - convert to base64 for storage
    cnic_front_data = None
    cnic_back_data = None
    
    if cnic_front_image:
        front_content = await cnic_front_image.read()
        # Validate image size (max 3MB before base64 encoding)
        if len(front_content) > 3 * 1024 * 1024:  # 3MB
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CNIC front image is too large. Maximum 3MB allowed."
            )
        # Log warning for large images
        if len(front_content) > 1024 * 1024:  # 1MB
            print(f"⚠️ Warning: CNIC front image is large ({len(front_content)} bytes)")
        cnic_front_data = base64.b64encode(front_content).decode('utf-8')
    
    if cnic_back_image:
        back_content = await cnic_back_image.read()
        # Validate image size (max 3MB before base64 encoding)
        if len(back_content) > 3 * 1024 * 1024:  # 3MB
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CNIC back image is too large. Maximum 3MB allowed."
            )
        # Log warning for large images
        if len(back_content) > 1024 * 1024:  # 1MB
            print(f"⚠️ Warning: CNIC back image is large ({len(back_content)} bytes)")
        cnic_back_data = base64.b64encode(back_content).decode('utf-8')
    
    # Generate verification token
    verification_token = generate_verification_token()
    token_expiry = generate_verification_token_expiry()
    
    # Create pending vendor verification
    pending_vendor = PendingVendorVerification(
        name=name,
        email=email,
        phone=phone,
        cnic_number=cleaned_cnic,
        cnic_front_image=cnic_front_data,
        cnic_back_image=cnic_back_data,
        password=hash_password(password),
        token=verification_token,
        expires_at=token_expiry
    )
    
    db.add(pending_vendor)
    db.commit()
    db.refresh(pending_vendor)
    
    # Send verification email
    email_sent = email_service.send_verification_email(
        to_email=email,
        user_name=name,
        verification_token=verification_token,
        verification_type="vendor"
    )
    
    if not email_sent:
        print(f"⚠️ Warning: Could not send verification email to {email}")
    
    return {
        "message": "Vendor registration submitted. Please check your email to verify your account. Your account will be activated after admin approval.",
        "email": email
    }

@vendor_router.get("/verify")
async def verify_vendor_email(token: str, db: Session = Depends(get_db)):
    """Verify vendor email and create vendor account (pending admin approval)"""
    
    # Load pending vendor verification from DB
    pending = db.query(PendingVendorVerification).filter(
        PendingVendorVerification.token == token
    ).first()
    
    if not pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    # Check if token is expired
    if is_token_expired(pending.expires_at):
        db.delete(pending)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired"
        )
    
    # Create new vendor account (inactive until admin approves)
    new_vendor = Vendor(
        name=pending.name,
        email=pending.email,
        phone=pending.phone,
        cnic_number=pending.cnic_number,
        cnic_front_image=pending.cnic_front_image,
        cnic_back_image=pending.cnic_back_image,
        password=pending.password,
        is_verified=True,  # Email verified
        is_active=False   # Needs admin approval
    )
    
    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)
    
    # Remove pending record
    db.delete(pending)
    db.commit()
    
    from fastapi.responses import RedirectResponse
    return RedirectResponse(
        url="http://localhost:8080/verification-success",
        status_code=status.HTTP_302_FOUND
    )

@vendor_router.post("/login")
async def vendor_login(credentials: VendorLogin, db: Session = Depends(get_db)):
    """Vendor login endpoint"""
    
    # Find vendor by email
    vendor = db.query(Vendor).filter(Vendor.email == credentials.email).first()
    
    if not vendor or not vendor.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, vendor.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if vendor is verified
    if not vendor.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email address before logging in"
        )
    
    # Check if vendor is active (admin approved)
    if not vendor.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your vendor account is pending admin approval"
        )
    
    # Create access token with vendor role
    access_token = create_access_token(data={"sub": str(vendor.id), "type": "vendor"})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": "vendor"
    }

@vendor_router.get("/me", response_model=VendorResponse)
async def get_vendor_info(
    current_vendor: Vendor = Depends(get_current_vendor),
    db: Session = Depends(get_db)
):
    """Get current vendor information - requires authentication"""
    return current_vendor

@vendor_router.put("/profile", response_model=VendorResponse)
async def update_vendor_profile(
    profile_data: VendorProfileUpdate,
    current_vendor: Vendor = Depends(get_current_vendor),
    db: Session = Depends(get_db)
):
    """Update vendor profile information"""
    if profile_data.name is not None:
        current_vendor.name = profile_data.name
    if profile_data.phone is not None:
        current_vendor.phone = profile_data.phone
    
    db.commit()
    db.refresh(current_vendor)
    return current_vendor

@vendor_router.post("/venues", response_model=VenueResponse)
async def create_venue(
    name: str = Form(...),
    description: str = Form(None),
    venue_type: str = Form(...),
    city: str = Form(...),
    address: str = Form(...),
    capacity: int = Form(...),
    price_per_day: float = Form(...),
    amenities: str = Form(None),
    images: List[UploadFile] = File(None),
    current_vendor: Vendor = Depends(get_current_vendor),
    db: Session = Depends(get_db)
):
    """Create a new venue"""
    # Check if vendor is active
    if not current_vendor.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your vendor account must be approved before adding venues"
        )
    
    # Process images
    image_data_list = []
    if images:
        for image in images:
            if image.filename:
                content = await image.read()
                # Validate image size (max 10MB per image)
                if len(content) > 10 * 1024 * 1024:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Image {image.filename} is too large. Maximum 10MB per image."
                    )
                image_base64 = base64.b64encode(content).decode('utf-8')
                image_data_list.append(image_base64)
    
    # Create venue
    new_venue = Venue(
        vendor_id=current_vendor.id,
        name=name,
        description=description,
        venue_type=venue_type,
        city=city,
        address=address,
        capacity=capacity,
        price_per_day=price_per_day,
        amenities=amenities,
        images=json.dumps(image_data_list) if image_data_list else None
    )
    
    db.add(new_venue)
    db.commit()
    db.refresh(new_venue)
    
    return new_venue

@vendor_router.get("/venues", response_model=List[VenueResponse])
async def get_vendor_venues(
    current_vendor: Vendor = Depends(get_current_vendor),
    db: Session = Depends(get_db)
):
    """Get all venues for the current vendor"""
    venues = db.query(Venue).filter(Venue.vendor_id == current_vendor.id).all()
    return venues

@vendor_router.get("/venues/{venue_id}", response_model=VenueResponse)
async def get_venue(
    venue_id: int,
    current_vendor: Vendor = Depends(get_current_vendor),
    db: Session = Depends(get_db)
):
    """Get a specific venue"""
    venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.vendor_id == current_vendor.id
    ).first()
    
    if not venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found"
        )
    
    return venue

@vendor_router.put("/venues/{venue_id}", response_model=VenueResponse)
async def update_venue(
    venue_id: int,
    name: str = Form(...),
    description: str = Form(None),
    venue_type: str = Form(...),
    city: str = Form(...),
    address: str = Form(...),
    capacity: int = Form(...),
    price_per_day: float = Form(...),
    amenities: str = Form(None),
    images: List[UploadFile] = File(None),
    current_vendor: Vendor = Depends(get_current_vendor),
    db: Session = Depends(get_db)
):
    """Update an existing venue"""
    # Check if vendor is active
    if not current_vendor.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your vendor account must be approved before updating venues"
        )
    
    # Get the venue
    venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.vendor_id == current_vendor.id
    ).first()
    
    if not venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found"
        )
    
    # Process images if provided
    if images:
        image_data_list = []
        for image in images:
            if image.filename:
                content = await image.read()
                # Validate image size (max 10MB per image)
                if len(content) > 10 * 1024 * 1024:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Image {image.filename} is too large. Maximum 10MB per image."
                    )
                image_base64 = base64.b64encode(content).decode('utf-8')
                image_data_list.append(image_base64)
        
        # Update images if new ones provided
        if image_data_list:
            venue.images = json.dumps(image_data_list)
    
    # Update venue fields
    venue.name = name
    venue.description = description
    venue.venue_type = venue_type
    venue.city = city
    venue.address = address
    venue.capacity = capacity
    venue.price_per_day = price_per_day
    venue.amenities = amenities
    venue.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(venue)
    
    return venue

@vendor_router.delete("/venues/{venue_id}")
async def delete_venue(
    venue_id: int,
    current_vendor: Vendor = Depends(get_current_vendor),
    db: Session = Depends(get_db)
):
    """Delete a venue"""
    venue = db.query(Venue).filter(
        Venue.id == venue_id,
        Venue.vendor_id == current_vendor.id
    ).first()
    
    if not venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venue not found"
        )
    
    db.delete(venue)
    db.commit()
    
    return {"message": "Venue deleted successfully"}


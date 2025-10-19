from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db, Vendor, User
from app.schemas.vendor import VendorResponse
from app.utils.auth import get_current_admin
from pydantic import BaseModel

admin_router = APIRouter(prefix="/admin", tags=["Admin"])

class VendorApprovalRequest(BaseModel):
    vendor_id: int
    approved: bool

@admin_router.get("/vendors", response_model=List[VendorResponse])
async def get_all_vendors(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Get all vendors (for admin dashboard)"""
    vendors = db.query(Vendor).all()
    return vendors

@admin_router.get("/vendors/pending")
async def get_pending_vendors(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Get vendors pending approval"""
    pending_vendors = db.query(Vendor).filter(
        Vendor.is_verified == True,
        Vendor.is_active == False
    ).all()
    return pending_vendors

@admin_router.get("/vendors/approved")
async def get_approved_vendors(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Get approved vendors"""
    approved_vendors = db.query(Vendor).filter(
        Vendor.is_verified == True,
        Vendor.is_active == True
    ).all()
    return approved_vendors

@admin_router.post("/vendors/approve")
async def approve_vendor(
    request: VendorApprovalRequest,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Approve or reject a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == request.vendor_id).first()
    
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    if not vendor.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vendor must be verified before approval"
        )
    
    vendor.is_active = request.approved
    db.commit()
    db.refresh(vendor)
    
    action = "approved" if request.approved else "rejected"
    return {
        "message": f"Vendor {action} successfully",
        "vendor_id": vendor.id,
        "vendor_name": vendor.name,
        "is_active": vendor.is_active
    }

@admin_router.get("/vendors/{vendor_id}")
async def get_vendor_details(
    vendor_id: int, 
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Get detailed vendor information including CNIC images"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    return {
        "id": vendor.id,
        "name": vendor.name,
        "email": vendor.email,
        "phone": vendor.phone,
        "cnic_number": vendor.cnic_number,
        "cnic_front_image": vendor.cnic_front_image,
        "cnic_back_image": vendor.cnic_back_image,
        "is_active": vendor.is_active,
        "is_verified": vendor.is_verified,
        "created_at": vendor.created_at,
        "updated_at": vendor.updated_at
    }

@admin_router.get("/stats")
async def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """Get admin dashboard statistics"""
    total_users = db.query(User).count()
    total_vendors = db.query(Vendor).count()
    pending_vendors = db.query(Vendor).filter(
        Vendor.is_verified == True,
        Vendor.is_active == False
    ).count()
    approved_vendors = db.query(Vendor).filter(
        Vendor.is_verified == True,
        Vendor.is_active == True
    ).count()
    
    return {
        "total_users": total_users,
        "total_vendors": total_vendors,
        "pending_vendors": pending_vendors,
        "approved_vendors": approved_vendors
    }





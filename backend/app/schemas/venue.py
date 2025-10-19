from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime

class VenueBase(BaseModel):
    name: str
    description: Optional[str] = None
    venue_type: str
    city: str
    address: str
    capacity: int
    price_per_day: float
    amenities: Optional[str] = None
    
    @field_validator('capacity')
    @classmethod
    def validate_capacity(cls, v: int) -> int:
        if v <= 0:
            raise ValueError('Capacity must be greater than 0')
        return v
    
    @field_validator('price_per_day')
    @classmethod
    def validate_price(cls, v: float) -> float:
        if v <= 0:
            raise ValueError('Price must be greater than 0')
        return v

class VenueCreate(VenueBase):
    images: Optional[List[str]] = None  # List of base64 encoded images

class VenueUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    venue_type: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    capacity: Optional[int] = None
    price_per_day: Optional[float] = None
    amenities: Optional[str] = None
    is_active: Optional[bool] = None

class VenueResponse(VenueBase):
    id: int
    vendor_id: int
    images: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class VendorProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.replace('-', '').replace(' ', '').replace('+', '')
        if len(cleaned) < 10:
            raise ValueError('Phone number must be at least 10 digits')
        return v


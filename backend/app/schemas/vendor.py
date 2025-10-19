from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

class VendorBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    cnic_number: str
    
    @field_validator('cnic_number')
    @classmethod
    def validate_cnic(cls, v: str) -> str:
        # Remove any dashes or spaces
        cleaned = v.replace('-', '').replace(' ', '')
        if len(cleaned) != 13:
            raise ValueError('CNIC number must be exactly 13 digits')
        if not cleaned.isdigit():
            raise ValueError('CNIC number must contain only digits')
        return cleaned
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Basic phone validation - can be enhanced
        cleaned = v.replace('-', '').replace(' ', '').replace('+', '')
        if len(cleaned) < 10:
            raise ValueError('Phone number must be at least 10 digits')
        return v

class VendorCreate(VendorBase):
    password: str
    cnic_front_image: Optional[str] = None
    cnic_back_image: Optional[str] = None

class VendorResponse(VendorBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class VendorLogin(BaseModel):
    email: EmailStr
    password: str


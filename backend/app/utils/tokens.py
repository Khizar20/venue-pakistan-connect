"""
Token generation utilities for email verification
"""

import secrets
import string
from datetime import datetime, timedelta
from typing import Optional

def generate_verification_token() -> str:
    """Generate a secure verification token"""
    return secrets.token_urlsafe(32)

def generate_verification_token_expiry() -> datetime:
    """Generate token expiry time (24 hours from now)"""
    return datetime.utcnow() + timedelta(hours=24)

def is_token_expired(expiry_time: Optional[datetime]) -> bool:
    """Check if verification token is expired"""
    if not expiry_time:
        return True
    return datetime.utcnow() > expiry_time

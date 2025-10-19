"""
Temporary storage for verification data before user creation
"""

from datetime import datetime
from typing import Dict, Optional
import threading

class VerificationStore:
    def __init__(self):
        self._store: Dict[str, dict] = {}
        self._lock = threading.Lock()
    
    def store_verification(self, token: str, data: dict) -> None:
        """Store verification data temporarily"""
        with self._lock:
            self._store[token] = data
    
    def get_verification(self, token: str) -> Optional[dict]:
        """Get verification data by token"""
        with self._lock:
            return self._store.get(token)
    
    def remove_verification(self, token: str) -> bool:
        """Remove verification data after successful verification"""
        with self._lock:
            if token in self._store:
                del self._store[token]
                return True
            return False
    
    def cleanup_expired(self) -> int:
        """Clean up expired verification data"""
        current_time = datetime.utcnow()
        expired_tokens = []
        
        with self._lock:
            for token, data in self._store.items():
                if data.get('verification_token_expires') and data['verification_token_expires'] < current_time:
                    expired_tokens.append(token)
            
            for token in expired_tokens:
                del self._store[token]
        
        return len(expired_tokens)

# Global verification store instance
verification_store = VerificationStore()

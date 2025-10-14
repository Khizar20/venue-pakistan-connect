from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db, User, PendingVerification
from app.utils.auth import hash_password, verify_password, create_access_token, get_current_user
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.email import email_service
from app.utils.tokens import generate_verification_token, generate_verification_token_expiry, is_token_expired

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

@auth_router.post("/signup")
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Send verification email for new user registration"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate verification token
    verification_token = generate_verification_token()
    token_expiry = generate_verification_token_expiry()
    
    # Persist pending verification in DB so it survives restarts
    pending = PendingVerification(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password=hash_password(user_data.password),
        role=user_data.role,
        token=verification_token,
        expires_at=token_expiry,
    )
    db.add(pending)
    db.commit()
    db.refresh(pending)
    
    # Send verification email
    email_sent = email_service.send_verification_email(
        to_email=user_data.email,
        user_name=user_data.name,
        verification_token=verification_token
    )
    
    if not email_sent:
        print(f"⚠️ Warning: Could not send verification email to {user_data.email}")
    
    return {
        "message": "Verification email sent. Please check your email to complete registration.",
        "email": user_data.email
    }

@auth_router.post("/login", response_model=Token)
async def login(request: Request, db: Session = Depends(get_db)):
    """Authenticate user and return access token"""
    # Support both JSON and form-encoded bodies
    try:
        payload = await request.json()
        user_credentials = UserLogin(**payload)
    except Exception:
        form = await request.form()
        user_credentials = UserLogin(email=form.get("email"), password=form.get("password"))

    # Find user by email
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user or not user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Check if email is verified
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email address before logging in"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@auth_router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@auth_router.post("/logout")
async def logout():
    """Logout user (client should discard token)"""
    return {"message": "Successfully logged out"}

@auth_router.get("/verify")
async def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify user email and create user account"""
    # Load pending verification from DB
    pending = db.query(PendingVerification).filter(PendingVerification.token == token).first()
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
    
    # Check if user already exists (in case they tried to signup again)
    existing_user = db.query(User).filter(User.email == pending.email).first()
    if existing_user:
        # User already exists, just verify them
        existing_user.is_verified = True
        existing_user.is_active = True
        existing_user.verification_token = None
        existing_user.verification_token_expires = None
        db.commit()
        
        # Send welcome email
        email_service.send_welcome_email(existing_user.email, existing_user.name)
        
        from fastapi.responses import RedirectResponse
        return RedirectResponse(
            url="http://localhost:8000/verification-success",
            status_code=status.HTTP_302_FOUND
        )
    
    # Create new user account
    new_user = User(
        name=pending.name,
        email=pending.email,
        phone=pending.phone,
        password=pending.password,
        role=pending.role,
        is_verified=True,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Remove pending record after successful creation
    db.delete(pending)
    db.commit()
    
    # Send welcome email
    email_service.send_welcome_email(new_user.email, new_user.name)
    
    from fastapi.responses import RedirectResponse
    
    # Redirect to success page
    return RedirectResponse(
        url="http://localhost:8000/verification-success",
        status_code=status.HTTP_302_FOUND
    )

@auth_router.post("/resend-verification")
async def resend_verification_email(request_data: dict, db: Session = Depends(get_db)):
    """Resend verification email"""
    email = request_data.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is required"
        )
    
    # Check if user already exists and is verified
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user and existing_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Load pending verification from DB
    pending = db.query(PendingVerification).filter(PendingVerification.email == email).first()
    if not pending:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No pending verification found for this email"
        )
    
    # Generate new verification token
    verification_token = generate_verification_token()
    token_expiry = generate_verification_token_expiry()
    
    # Update pending verification in DB
    pending.token = verification_token
    pending.expires_at = token_expiry
    db.commit()
    db.refresh(pending)
    
    # Send verification email
    email_sent = email_service.send_verification_email(
        to_email=email,
        user_name=pending.name,
        verification_token=verification_token
    )
    
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email"
        )
    
    return {"message": "Verification email sent successfully"}

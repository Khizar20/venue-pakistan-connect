# Shadiejo Authentication Implementation Guide

This document provides a comprehensive guide to the authentication system implemented for the Shadiejo platform, including both user and vendor signup/login functionality.

## Table of Contents
1. [Overview](#overview)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [Setup Instructions](#setup-instructions)
5. [API Endpoints](#api-endpoints)
6. [Features](#features)

---

## Overview

The Shadiejo platform now includes a complete authentication system with the following capabilities:

### User Authentication
- Email/Password registration with email verification
- Google OAuth login
- JWT-based authentication
- User dashboard

### Vendor Authentication
- Vendor registration with CNIC verification
- Email verification
- Admin approval workflow
- CNIC image upload (front and back)
- 13-digit CNIC number validation

---

## Backend Implementation

### Database Models

#### 1. **User Model** (`backend/app/core/database.py`)
```python
- id: Integer (Primary Key)
- name: String (100)
- email: String (255, Unique)
- phone: String (20, Optional)
- password: String (255, Nullable for OAuth)
- role: String (50, default="user")
- is_active: Boolean
- is_verified: Boolean
- google_id: String (255, Unique, Optional)
- created_at: DateTime
- updated_at: DateTime
```

#### 2. **Vendor Model** (`backend/app/core/database.py`)
```python
- id: Integer (Primary Key)
- name: String (100)
- email: String (255, Unique)
- phone: String (20)
- cnic_number: String (13, Unique)
- cnic_front_image: String (500, Base64 encoded)
- cnic_back_image: String (500, Base64 encoded)
- password: String (255)
- is_active: Boolean (default=False, requires admin approval)
- is_verified: Boolean (default=False)
- created_at: DateTime
- updated_at: DateTime
```

#### 3. **PendingVerification Model**
Stores user signup data pending email verification.

#### 4. **PendingVendorVerification Model**
Stores vendor signup data pending email verification.

### API Routes

#### User Authentication Routes (`/auth`)
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout
- `GET /auth/verify?token={token}` - Email verification
- `POST /auth/resend-verification` - Resend verification email

#### OAuth Routes (`/auth/oauth`)
- `GET /auth/oauth/google` - Initiate Google login
- `GET /auth/oauth/google/callback` - Google OAuth callback

#### Vendor Routes (`/vendor`)
- `POST /vendor/signup` - Vendor registration (multipart/form-data)
- `POST /vendor/login` - Vendor login
- `GET /vendor/verify?token={token}` - Vendor email verification
- `GET /vendor/me` - Get current vendor info

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)
- `http://localhost:8000` (Backend itself)

---

## Frontend Implementation

### Pages

#### 1. **Login Page** (`frontend/src/pages/Login.tsx`)
- Email/Password login form
- Google OAuth button
- Link to signup page
- Password visibility toggle
- Toast notifications for errors/success

#### 2. **Signup Page** (`frontend/src/pages/Signup.tsx`)
- Tabbed interface for User/Vendor signup
- Uses `Tabs` component from shadcn/ui
- Links to login page

#### 3. **Dashboard Page** (`frontend/src/pages/Dashboard.tsx`)
- Protected route (requires authentication)
- Displays user information
- Profile card with user details
- Account status indicators
- Logout functionality

### Components

#### 1. **UserSignupForm** (`frontend/src/components/auth/UserSignupForm.tsx`)
Features:
- Full name input
- Email input
- Phone number (optional)
- Password with confirmation
- Password visibility toggles
- Google OAuth option
- Form validation
- API integration

#### 2. **VendorSignupForm** (`frontend/src/components/auth/VendorSignupForm.tsx`)
Features:
- Full name input
- Email input
- Phone number (required)
- CNIC number with auto-formatting (XXXXX-XXXXXXX-X)
- CNIC front image upload
- CNIC back image upload
- Password with confirmation
- File upload validation (type and size)
- Visual upload interface with drag-and-drop styling
- Admin approval notice

#### 3. **Navbar Updates**
- Added Login and Sign Up buttons
- Styled with theme colors

### State Management

- Uses React `useState` for form state
- Uses `localStorage` for JWT token storage
- Uses `react-router-dom` for navigation
- Uses `@tanstack/react-query` for API state management

### API Integration

Created centralized API utility (`frontend/src/lib/api.ts`):
- `api.login()` - User login
- `api.signup()` - User signup
- `api.getCurrentUser()` - Fetch current user
- `api.logout()` - Logout
- `api.vendorSignup()` - Vendor signup with FormData
- `api.vendorLogin()` - Vendor login
- `api.googleLogin()` - Redirect to Google OAuth

---

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost/shadiejo
   SECRET_KEY=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # SMTP Configuration (for email verification)
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_USE_TLS=True
   SMTP_FROM_EMAIL=your-email@gmail.com
   ```

4. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

5. **Start the backend server**
   ```bash
   python run.py
   # OR
   cd ..
   python backend/run.py
   ```

   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
python run.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## API Endpoints

### User Endpoints

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+92 300 1234567",
  "password": "securepassword",
  "role": "user"
}
```

Response:
```json
{
  "message": "Verification email sent. Please check your email to complete registration.",
  "email": "john@example.com"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {access_token}
```

Response:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+92 300 1234567",
  "role": "user",
  "is_active": true,
  "is_verified": true,
  "created_at": "2025-10-14T10:30:00"
}
```

### Vendor Endpoints

#### Vendor Sign Up
```http
POST /vendor/signup
Content-Type: multipart/form-data

FormData:
- name: "Venue Owner Name"
- email: "vendor@example.com"
- phone: "+92 300 1234567"
- cnic_number: "1234567890123"
- password: "securepassword"
- cnic_front_image: [File]
- cnic_back_image: [File]
```

Response:
```json
{
  "message": "Vendor registration submitted. Please check your email to verify your account. Your account will be activated after admin approval.",
  "email": "vendor@example.com"
}
```

#### Vendor Login
```http
POST /vendor/login
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_type": "vendor"
}
```

### OAuth Endpoints

#### Google Login
```http
GET /auth/oauth/google
```

Redirects to Google OAuth consent screen.

#### Google Callback
```http
GET /auth/oauth/google/callback?code={auth_code}&state={state}
```

Redirects to dashboard with token.

---

## Features

### Security Features

1. **Password Hashing**: Uses bcrypt for secure password storage
2. **JWT Tokens**: Secure token-based authentication
3. **Email Verification**: Required before account activation
4. **CORS Protection**: Configured allowed origins
5. **Session Management**: OAuth state parameter for CSRF protection

### User Experience Features

1. **Password Visibility Toggle**: Eye icon to show/hide passwords
2. **Form Validation**: Real-time validation with helpful error messages
3. **Toast Notifications**: User feedback for all actions
4. **Loading States**: Visual feedback during API calls
5. **Responsive Design**: Mobile-friendly interface
6. **Auto-formatting**: CNIC number auto-formats as user types

### Vendor-Specific Features

1. **CNIC Validation**: 13-digit format validation
2. **Image Upload**: Drag-and-drop interface for CNIC images
3. **File Validation**: Type and size checks (max 5MB)
4. **Base64 Storage**: Images stored as base64 strings in database
5. **Admin Approval**: Two-stage verification (email + admin)

### Admin Features

1. **User Management**: View all users at `/admin/users`
2. **Pending Verifications**: View pending verifications at `/admin/pending`
3. **User Deletion**: Delete users by ID
4. **Vendor Approval**: Manual vendor activation (requires admin panel extension)

---

## Workflow Diagrams

### User Registration Flow
```
User fills form → POST /auth/signup → Email sent → 
User clicks email link → GET /auth/verify → Account activated → 
User can login
```

### Vendor Registration Flow
```
Vendor fills form + uploads CNIC → POST /vendor/signup → Email sent → 
Vendor clicks email link → GET /vendor/verify → Account verified (inactive) → 
Admin approves → Account activated → Vendor can login
```

### Login Flow
```
User enters credentials → POST /auth/login → 
JWT token returned → Stored in localStorage → 
Redirected to dashboard
```

### Google OAuth Flow
```
User clicks "Continue with Google" → Redirected to Google → 
User approves → Callback to backend → User created/updated → 
JWT token generated → Redirected to dashboard with token
```

---

## Testing Checklist

### User Authentication
- [ ] User can sign up with email/password
- [ ] Verification email is sent
- [ ] User can verify email via link
- [ ] User can log in after verification
- [ ] User cannot login without verification
- [ ] User can log in with Google OAuth
- [ ] Dashboard displays user information
- [ ] User can logout

### Vendor Authentication
- [ ] Vendor can sign up with all required fields
- [ ] CNIC number validation works
- [ ] CNIC images can be uploaded
- [ ] File size/type validation works
- [ ] Verification email is sent
- [ ] Vendor can verify email
- [ ] Vendor cannot login without verification
- [ ] Vendor cannot login without admin approval
- [ ] Vendor can login after approval

### Security
- [ ] Passwords are hashed in database
- [ ] JWT tokens are properly validated
- [ ] Protected routes require authentication
- [ ] CORS is properly configured
- [ ] SQL injection prevention works

---

## Troubleshooting

### Common Issues

**Issue**: "Email already registered"
- **Solution**: Email must be unique. Use different email or login with existing account.

**Issue**: "CNIC number must be 13 digits"
- **Solution**: Ensure CNIC is exactly 13 digits without dashes.

**Issue**: "Verification email not received"
- **Solution**: Check spam folder. Verify SMTP configuration in backend `.env`.

**Issue**: "Vendor account pending approval"
- **Solution**: Contact admin to approve vendor account.

**Issue**: "CORS error in browser console"
- **Solution**: Ensure frontend URL is in backend CORS allowed origins.

**Issue**: "File too large" when uploading CNIC
- **Solution**: Reduce image size to under 5MB.

---

## Future Enhancements

1. **Password Reset**: Implement forgot password functionality
2. **Profile Edit**: Allow users to update their information
3. **Admin Panel**: Create full admin dashboard for vendor approvals
4. **2FA**: Add two-factor authentication option
5. **Social Login**: Add Facebook, LinkedIn OAuth
6. **Email Templates**: Custom HTML email templates
7. **Rate Limiting**: Add API rate limiting for security
8. **Session Management**: Add session expiry and refresh tokens
9. **Vendor Dashboard**: Separate dashboard for vendors
10. **Document Verification**: OCR for CNIC verification

---

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check the backend logs
4. Check browser console for frontend errors
5. Verify environment variables are correctly set

---

## License

This project is part of the Shadiejo platform.

---

**Last Updated**: October 14, 2025


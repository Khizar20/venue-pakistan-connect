# Quick Start Guide - Shadiejo Authentication

Get your Shadiejo authentication system up and running in 5 minutes!

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ installed
- PostgreSQL database running
- Google OAuth credentials (optional, for Google login)

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://username:password@localhost/shadiejo
SECRET_KEY=your-secret-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_USE_TLS=True
SMTP_FROM_EMAIL=your-email@gmail.com
EOF

# Run database migrations
alembic upgrade head

# Start backend server
python run.py
```

Backend will run on: **http://localhost:8000**

## Step 2: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

## Step 3: Test the System (1 minute)

1. Open your browser to **http://localhost:5173**
2. Click "Sign Up" in the navigation
3. Choose "Sign up as User" or "Sign up as Vendor"
4. Fill the form and submit
5. Check your email for verification link (if SMTP configured)
6. Click verification link to activate account
7. Return to **http://localhost:5173/login**
8. Log in with your credentials
9. You'll be redirected to the dashboard!

## Quick Test with Google OAuth

1. Go to **http://localhost:5173/login**
2. Click "Continue with Google"
3. Approve the Google consent
4. Automatically redirected to dashboard

## Available Routes

### Frontend Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page (User/Vendor tabs)
- `/dashboard` - User dashboard (protected)

### Backend API Routes
- `http://localhost:8000/docs` - Interactive API documentation (Swagger UI)
- `http://localhost:8000/redoc` - Alternative API documentation
- `http://localhost:8000/admin/users` - View all users (JSON)
- `http://localhost:8000/admin/pending` - View pending verifications (JSON)

## Test Accounts

After running the system, you can create test accounts:

### User Account
```
Email: user@test.com
Password: testpassword123
```

### Vendor Account
```
Email: vendor@test.com
Password: testpassword123
CNIC: 1234567890123
```

Note: Vendor accounts need admin approval after email verification.

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure port 8000 is available

### Frontend won't start
- Delete `node_modules` and run `npm install` again
- Ensure port 5173 is available
- Check for TypeScript errors

### Emails not sending
- Verify SMTP credentials in .env
- For Gmail: use App Password, not regular password
- Check spam folder

### CORS errors
- Ensure backend is running on port 8000
- Ensure frontend is running on port 5173
- Check backend CORS configuration in `backend/app/main.py`

## What's Implemented

✅ User registration with email verification  
✅ User login with email/password  
✅ Google OAuth login  
✅ Vendor registration with CNIC upload  
✅ Vendor email verification  
✅ JWT-based authentication  
✅ Protected dashboard route  
✅ Password hashing  
✅ CORS configuration  
✅ Responsive UI  
✅ Toast notifications  
✅ Form validation  

## Next Steps

1. Configure real SMTP credentials for email
2. Set up Google OAuth credentials
3. Create admin panel for vendor approvals
4. Add password reset functionality
5. Deploy to production

## Getting Help

- Check `IMPLEMENTATION_GUIDE.md` for detailed documentation
- Review backend logs in terminal
- Check browser console for frontend errors
- Visit `http://localhost:8000/docs` for API documentation

---

**Happy Coding! 🎉**


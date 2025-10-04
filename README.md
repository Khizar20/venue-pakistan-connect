# Shadiejo - FastAPI Authentication Application

A complete FastAPI application with user authentication, OAuth integration, and a modern web interface.

## Features

- ✅ User registration and login
- ✅ Password hashing with SHA256
- ✅ JWT token authentication
- ✅ Google OAuth integration
- ✅ SQLAlchemy ORM with PostgreSQL
- ✅ Modern responsive frontend
- ✅ User roles and permissions
- ✅ Protected routes

## Project Structure

```
shadiejo/
├── main.py              # FastAPI application entry point
├── settings.py          # Application settings and configuration
├── database.py          # Database models and connection
├── auth.py              # Authentication utilities
├── auth_routes.py       # Authentication endpoints
├── oauth.py             # OAuth integration
├── models.py            # Pydantic models
├── requirements.txt     # Python dependencies
├── templates/           # HTML templates
│   ├── base.html
│   ├── login.html
│   ├── signup.html
│   └── dashboard.html
└── static/              # Static files (CSS, JS, images)
```

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/shadiejo_db
SECRET_KEY=your-super-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Database Setup

Make sure PostgreSQL is running and create a database:

```sql
CREATE DATABASE shadiejo_db;
```

The application will automatically create the required tables on startup.

### 4. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:8000/auth/oauth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

### 5. Run the Application

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - User logout

### OAuth
- `GET /auth/oauth/google` - Initiate Google OAuth
- `GET /auth/oauth/google/callback` - Google OAuth callback

### Frontend Routes
- `GET /` - Home page (login)
- `GET /login` - Login page
- `GET /signup` - Signup page
- `GET /dashboard` - User dashboard

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - User's email (unique)
- `phone` - User's phone number (optional)
- `password` - Hashed password (SHA256)
- `role` - User role (user/admin)
- `is_active` - Account status
- `is_verified` - Email verification status
- `google_id` - Google OAuth ID (for OAuth users)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

## Security Features

- SHA256 password hashing
- JWT token authentication
- Protected routes with Bearer token
- OAuth 2.0 integration
- Input validation with Pydantic
- CORS support

## Frontend Features

- Responsive design with Bootstrap 5
- Modern gradient backgrounds
- Interactive forms with JavaScript
- Token-based authentication
- Google OAuth integration
- User dashboard

## Development

The application uses:
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Jinja2** - Template engine
- **Bootstrap 5** - Frontend framework
- **JWT** - JSON Web Tokens for authentication
- **Authlib** - OAuth library

## Production Deployment

For production deployment:

1. Set strong `SECRET_KEY` in environment variables
2. Use a production database (PostgreSQL recommended)
3. Configure proper CORS settings
4. Use HTTPS for OAuth redirects
5. Set up proper logging and monitoring
6. Use a production ASGI server like Gunicorn with Uvicorn workers

## License

This project is open source and available under the MIT License.

# Shadiejo - FastAPI Authentication System

A scalable FastAPI application with user authentication and OAuth integration.

## Project Structure

```
Shadiejo/
├── app/                    # Main application package
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication routes
│   │   └── oauth/         # OAuth routes
│   ├── core/              # Core configuration
│   │   ├── config.py      # Application settings
│   │   └── database.py    # Database models and connection
│   ├── schemas/           # Pydantic models
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── main.py           # FastAPI application
│   └── run.py            # Application runner
├── alembic/              # Database migrations
├── templates/            # HTML templates
├── static/              # Static files
├── tests/               # Test files
├── main.py             # Entry point
├── run.py              # Startup script
├── requirements.txt    # Dependencies
└── README.md          # This file
```

## Features

- **User Authentication**: Registration, login, logout
- **OAuth Integration**: Google OAuth2 support
- **JWT Tokens**: Secure token-based authentication
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic for database schema management
- **Scalable Architecture**: Modular structure for easy expansion

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Environment Variables**
   Create a `.env` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost/shadiejo
   SECRET_KEY=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Run Database Migrations**
   ```bash
   alembic upgrade head
   ```

4. **Start the Application**
   ```bash
   python run.py
   ```

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - User logout

### OAuth
- `GET /auth/oauth/google` - Google OAuth login
- `GET /auth/oauth/google/callback` - Google OAuth callback

### Web Pages
- `GET /` - Home page (login)
- `GET /login` - Login page
- `GET /signup` - Signup page
- `GET /dashboard` - Dashboard page

## Development

The project follows a scalable architecture:

- **app/core/**: Configuration and database setup
- **app/api/**: API route handlers organized by feature
- **app/schemas/**: Pydantic models for request/response validation
- **app/services/**: Business logic (can be added as the app grows)
- **app/utils/**: Utility functions and helpers

## Database

The application uses PostgreSQL with SQLAlchemy ORM. Database migrations are handled by Alembic.

## Testing

Run tests with:
```bash
pytest tests/
```

## Deployment

The application is ready for deployment with:
- Docker support
- Environment-based configuration
- Database migrations
- Static file serving
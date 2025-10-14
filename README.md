# Shadiejo - Full Stack Application

A full-stack application with FastAPI backend and React frontend for venue management and user authentication.

## Project Structure

```
Shadiejo/
├── backend/                 # FastAPI Backend
│   ├── app/                # Main application package
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # Authentication routes
│   │   │   └── oauth/     # OAuth routes
│   │   ├── core/          # Core configuration
│   │   │   ├── config.py  # Application settings
│   │   │   └── database.py # Database models and connection
│   │   ├── schemas/       # Pydantic models
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── main.py       # FastAPI application
│   │   └── run.py        # Application runner
│   ├── alembic/          # Database migrations
│   ├── templates/        # HTML templates
│   ├── static/          # Static files
│   ├── tests/           # Test files
│   ├── requirements.txt # Python dependencies
│   └── README.md       # Backend documentation
├── frontend/             # React Frontend (from Lovable)
│   ├── src/             # Source code
│   ├── public/          # Public assets
│   ├── package.json     # Node.js dependencies
│   └── vite.config.ts   # Vite configuration
└── README.md           # This file
```

## Backend Features (FastAPI)

- **User Authentication**: Registration, login, logout
- **OAuth Integration**: Google OAuth2 support
- **JWT Tokens**: Secure token-based authentication
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic for database schema management
- **Scalable Architecture**: Modular structure for easy expansion

## Frontend Features (React)

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Component Library**: shadcn-ui for consistent design
- **Fast Development**: Vite for quick builds and hot reloading
- **Responsive Design**: Mobile-first approach

## Quick Start

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Environment Variables**
   Create a `.env` file in the backend directory:
   ```
   DATABASE_URL=postgresql://username:password@localhost/shadiejo
   SECRET_KEY=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Run Database Migrations**
   ```bash
   alembic upgrade head
   ```

5. **Start the Backend**
   ```bash
   python run.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints (Backend)

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

## Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Relational database
- **SQLAlchemy**: Python ORM
- **Alembic**: Database migrations
- **JWT**: Authentication tokens
- **OAuth2**: Third-party authentication

### Frontend
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn-ui**: Component library

## Development

### Backend Development
The backend follows a scalable architecture:
- **app/core/**: Configuration and database setup
- **app/api/**: API route handlers organized by feature
- **app/schemas/**: Pydantic models for request/response validation
- **app/services/**: Business logic
- **app/utils/**: Utility functions and helpers

### Frontend Development
The frontend is built with modern React patterns:
- Component-based architecture
- TypeScript for type safety
- Tailwind CSS for styling
- Vite for fast development

## Testing

### Backend Testing
```bash
cd backend
pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
The backend is ready for deployment with:
- Docker support
- Environment-based configuration
- Database migrations
- Static file serving

### Frontend Deployment
The frontend can be deployed using:
- [Lovable](https://lovable.dev/projects/f8ec687c-ef6e-4aa2-835a-a4fda07219cb) - Click Share -> Publish
- Vercel, Netlify, or any static hosting service
- Custom domain support available

## Lovable Integration

This project is integrated with [Lovable](https://lovable.dev/projects/f8ec687c-ef6e-4aa2-835a-a4fda07219cb) for frontend development:

- Visit the Lovable Project to make frontend changes
- Changes are automatically committed to this repository
- Local development is supported with `npm run dev`
- Custom domains can be connected through Lovable settings

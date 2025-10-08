from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
import time
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
import uvicorn

from app.api.auth.routes import auth_router
from app.api.oauth.routes import oauth_router
from app.core.database import engine, Base
from app.core.config import settings

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: wait for DB to be ready, then create tables
    max_attempts = 30
    for attempt in range(1, max_attempts + 1):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            break
        except OperationalError:
            if attempt == max_attempts:
                raise
            time.sleep(2)
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Shadiejo Authentication API",
    description="FastAPI application with user authentication and OAuth",
    version="1.0.0",
    lifespan=lifespan
)

# Add session middleware for OAuth
app.add_middleware(SessionMiddleware, secret_key=settings.secret_key)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Include routers
app.include_router(auth_router)
app.include_router(oauth_router)

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/signup", response_class=HTMLResponse)
async def signup_page(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

@app.post("/signup", response_class=HTMLResponse)
async def signup_form_submit(request: Request):
    """Handle form submission from signup page"""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/signup", status_code=302)

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/verification-success", response_class=HTMLResponse)
async def verification_success_page(request: Request):
    return templates.TemplateResponse("verification_success.html", {"request": request})

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Shadiejo API is running"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

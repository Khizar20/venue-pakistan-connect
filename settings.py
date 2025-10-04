from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None

    class Config:
        env_file = ".env"   # automatically load from .env
        env_file_encoding = "utf-8"

settings = Settings()
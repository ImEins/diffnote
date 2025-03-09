from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_PATH = Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=f'{BASE_PATH}/.env',
        env_file_encoding='utf-8',
        extra='ignore',
        validate_default=False,
    )

    # Env Config
    ENVIRONMENT: Literal['dev', 'prod']

    # Env Postgres
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_DB: str
    POSTGRES_PASSWORD: str

    # FastAPI
    FASTAPI_API_V1_PATH: str = '/api'
    FASTAPI_TITLE: str = 'DiffNote'
    FASTAPI_VERSION: str = '0.0.1'
    FASTAPI_DESCRIPTION: str = 'DiffNote API'
    FASTAPI_DOCS_URL: str | None = f'{FASTAPI_API_V1_PATH}/docs'
    FASTAPI_REDOCS_URL: str | None = f'{FASTAPI_API_V1_PATH}/redocs'
    FASTAPI_OPENAPI_URL: str | None = f'{FASTAPI_API_V1_PATH}/openapi'

    # CORS
    CORS_ALLOWED_ORIGINS: list[str] = [
        'http://localhost:5173',
    ]

    # Log
    LOG_LEVEL: str = 'INFO'
    LOG_FORMAT: str = '<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</> | <lvl>{level: <8}</> | <lvl>{message}</>'
    LOG_DIR: Path = Path(BASE_PATH) / 'logs'


@lru_cache
def get_settings() -> Settings:
    """Get global settings"""

    return Settings.model_validate({})


@lru_cache
def get_db_url(type: Literal['asyncpg', 'psycopg2'] = 'asyncpg') -> str:
    """Get database URL"""

    return f'postgresql+{type}://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}'


# Create configuration instance
settings = get_settings()

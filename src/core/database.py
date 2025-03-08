from typing import Annotated, AsyncGenerator

from fastapi import Depends
from sqlalchemy import URL
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

from src.common.exceptions import DatabaseConnectionError
from src.common.log import log
from src.core.settings import settings


def create_engine_and_session(url: str | URL):
    """
    Create an async engine and a session for the database.
    """
    try:
        engine = create_async_engine(url, echo=False, future=True, pool_pre_ping=True)
    except Exception as e:
        log.critical(f'❌ No connection to the database -> {e}')

        raise DatabaseConnectionError()
    else:
        db_session = async_sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
        return engine, db_session


async_engine, async_db_session = create_engine_and_session(
    f'postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}'
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Get a new session for the database.
    """
    async with AsyncSession(async_engine) as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


async def create_db_tables():
    """
    Create all tables in the database. Called when the application starts.
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def dispose_db():
    """
    Dispose the database. Called when the application shuts down.
    """
    if async_engine:
        await async_engine.dispose()


AsyncSessionDep = Annotated[AsyncSession, Depends(get_session)]

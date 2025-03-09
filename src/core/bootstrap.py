from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.common.exception_handlers import register_exception_handlers
from src.common.log import setup_logging
from src.core.database import create_db_tables, dispose_db
from src.core.settings import settings
from src.pkg.router import router


@asynccontextmanager
async def lifespan(_: FastAPI):
    """
    Lifespan for the FastAPI app.

    All the operations that need to be done when the app starts and shuts down after the request is processed.
    """
    await create_db_tables()

    yield

    await dispose_db()


def register_app():
    """
    Register the FastAPI app with needed configurations and dependencies.
    """
    app = FastAPI(
        title=settings.FASTAPI_TITLE,
        version=settings.FASTAPI_VERSION,
        description=settings.FASTAPI_DESCRIPTION,
        docs_url=settings.FASTAPI_DOCS_URL,
        redoc_url=settings.FASTAPI_REDOCS_URL,
        openapi_url=settings.FASTAPI_OPENAPI_URL,
        lifespan=lifespan,
    )

    setup_logging()

    register_middleware(app)
    register_router(app)
    register_exception_handlers(app)
    return app


def register_middleware(app: FastAPI):
    """
    Register the middleware for the FastAPI app.
    """

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )


def register_router(app: FastAPI):
    """
    Register the router for the FastAPI app.
    """
    app.include_router(router)

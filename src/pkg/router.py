from fastapi import APIRouter

from src.core.settings import settings

from .note import note_router, version_router

router = APIRouter(prefix=settings.FASTAPI_API_V1_PATH)

router.include_router(note_router, prefix='/note', tags=['note'])
router.include_router(version_router, prefix='/version', tags=['version'])

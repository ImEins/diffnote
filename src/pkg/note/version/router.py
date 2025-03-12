from fastapi import APIRouter

from src.common.pagination import DependsPagination, paging_data
from src.common.schemas import PaginationSchema, ResponseModel, response_base

from .schema import NoteVersionCreateSchema, NoteVersionResponseSchema
from .service import NoteVersionServiceDI

router = APIRouter()


@router.post('/', summary='Create a new note version', response_model=ResponseModel[NoteVersionResponseSchema])
async def create_note_version(note_version: NoteVersionCreateSchema, note_version_service: NoteVersionServiceDI):
    note_version_data = await note_version_service.create_note_version(note_version)

    return await response_base.success(data=note_version_data)


@router.get(
    '/{note_id}',
    summary='Get all note versions for a note',
    dependencies=[
        DependsPagination,
    ],
    response_model=ResponseModel[PaginationSchema[NoteVersionResponseSchema]],
)
async def get_note_versions(
    note_id: int, note_version_service: NoteVersionServiceDI
) -> ResponseModel[PaginationSchema[NoteVersionResponseSchema]]:
    note_versions_query = await note_version_service.get_note_versions(note_id)
    page_data = await paging_data(
        db=note_version_service.db_session,
        select=note_versions_query,
        page_data_schema=NoteVersionResponseSchema,
    )

    return await response_base.success(data=page_data)

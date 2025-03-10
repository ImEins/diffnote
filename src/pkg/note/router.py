from fastapi import APIRouter

from src.common.pagination import DependsPagination, paging_data
from src.common.schemas import PaginationSchema, ResponseModel, response_base
from src.pkg.note.schema import NoteCreateSchema, NoteResponseSchema, NoteUpdateSchema

from .service import NoteServiceDI

router = APIRouter()


@router.post('/', summary='Create a new note', response_model=ResponseModel[NoteResponseSchema])
async def create_note(note: NoteCreateSchema, note_service: NoteServiceDI) -> ResponseModel[NoteResponseSchema]:
    note_data = await note_service.create_note(note)

    return await response_base.success(data=note_data)


@router.get('/{note_id}', summary='Get a note by its ID', response_model=ResponseModel[NoteResponseSchema])
async def get_note(note_id: int, note_service: NoteServiceDI) -> ResponseModel[NoteResponseSchema]:
    note_data = await note_service.get_note(note_id)

    return await response_base.success(data=note_data)


@router.get(
    '/',
    summary='Get all notes',
    response_model=ResponseModel[PaginationSchema[NoteResponseSchema]],
    dependencies=[
        DependsPagination,
    ],
)
async def get_notes(
    note_service: NoteServiceDI,
) -> ResponseModel[PaginationSchema[NoteResponseSchema]]:
    notes_query = await note_service.get_notes()
    page_data = await paging_data(db=note_service.db_session, select=notes_query, page_data_schema=NoteResponseSchema)

    return await response_base.success(data=page_data)


@router.put('/{note_id}', summary='Update a note by its ID', response_model=ResponseModel[NoteResponseSchema])
async def update_note(
    note_id: int, note: NoteUpdateSchema, note_service: NoteServiceDI
) -> ResponseModel[NoteResponseSchema]:
    note_data = await note_service.update_note(note_id, note)

    return await response_base.success(data=note_data)


@router.delete('/{note_id}', summary='Delete a note by its ID')
async def delete_note(note_id: int, note_service: NoteServiceDI) -> ResponseModel[None]:
    await note_service.delete_note(note_id)

    return await response_base.success(data=None)

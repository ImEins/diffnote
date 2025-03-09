from fastapi import APIRouter

from src.pkg.note.schema import NoteCreateSchema, NoteResponseSchema

from .model import Note as NoteModel
from .service import NoteServiceDI

router = APIRouter()


@router.post('/', summary='Create a new note')
async def create_note(note: NoteCreateSchema, note_service: NoteServiceDI) -> NoteResponseSchema:
    return await note_service.create_note(note)


@router.get('/{note_id}', summary='Get a note by its ID')
async def get_note(note_id: int, note_service: NoteServiceDI) -> NoteModel:
    return await note_service.get_note(note_id)

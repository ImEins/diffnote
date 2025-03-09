from typing import Annotated

from fastapi import Depends

from .crud import note_crud
from .dependencies import DatabaseSession
from .model import Note as NoteModel
from .schema import NoteCreateSchema, NoteResponseSchema


class NoteService(DatabaseSession):
    """
    Service for the Note model.

    Args:
        db_session: The database session.
    """

    async def create_note(self, note: NoteCreateSchema) -> NoteResponseSchema:
        """
        Create a new note.

        Args:
            note: The note to create.

        Returns:
            The created note.
        """
        note_model = await note_crud.create_note(self.db_session, note)
        return NoteResponseSchema(**note_model.model_dump())

    async def get_note(self, note_id: int) -> NoteModel:
        """
        Get a note by its ID.

        Args:
            note_id: The ID of the note to get.

        Returns:
            The note with the given ID.
        """
        return await note_crud.get_note(self.db_session, note_id)


NoteServiceDI = Annotated[NoteService, Depends(NoteService)]

from typing import Annotated, Any

from fastapi import Depends
from sqlmodel.sql.expression import SelectOfScalar

from .crud import note_crud
from .dependencies import DatabaseSession
from .model import Note as NoteModel
from .schema import NoteCreateSchema, NoteResponseSchema, NoteUpdateSchema


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
        note_data = note.model_dump()
        db_note = NoteModel(**note_data)

        note_model = await note_crud.create_note(self.db_session, db_note)

        return NoteResponseSchema.model_validate(note_model)

    async def get_note(self, note_id: int) -> NoteResponseSchema:
        """
        Get a note by its ID.

        Args:
            note_id: The ID of the note to get.

        Returns:
            The note with the given ID.
        """
        note_model = await note_crud.get_note(self.db_session, note_id)

        return NoteResponseSchema.model_validate(note_model)

    async def get_notes(self, **kwargs: Any) -> SelectOfScalar[Any]:
        """
        Get all notes.
        """
        notes = await note_crud.get_notes(self.db_session, **kwargs)
        return notes

    async def update_note(self, note_id: int, note: NoteUpdateSchema) -> NoteResponseSchema:
        """
        Update a note by its ID.
        """
        note_data = note.model_dump()
        db_note = NoteModel(**note_data)

        note_model = await note_crud.update_note(self.db_session, note_id, db_note)

        return NoteResponseSchema.model_validate(note_model)

    async def delete_note(self, note_id: int) -> None:
        """
        Delete a note by its ID.
        """
        await note_crud.delete_note(self.db_session, note_id)


NoteServiceDI = Annotated[NoteService, Depends(NoteService)]

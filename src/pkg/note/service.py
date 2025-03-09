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
        # Parse the JSON string into a dict if it's a string
        content_dict = note.content
        if isinstance(content_dict, str):
            import json

            try:
                content_dict = json.loads(content_dict)
            except json.JSONDecodeError:
                content_dict = {'text': content_dict}

        # Create note with the dict content
        note_data = note.model_dump()
        note_data['content'] = content_dict
        db_note = NoteModel(**note_data)

        # Save the note to the database
        note_model = await note_crud.create_note(self.db_session, db_note)

        return NoteResponseSchema.model_validate(note_model)

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

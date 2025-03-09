from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from .model import Note as NoteModel


class NoteCRUD:
    """
    CRUD operations for the Note model.
    """

    @staticmethod
    async def create_note(db: AsyncSession, note: NoteModel) -> NoteModel:
        """
        Create a new note.

        Args:
            db: The database session.
            note: The note to create.

        Returns:
            The created note.
        """
        db.add(note)
        await db.commit()
        await db.refresh(note)
        return note

    @staticmethod
    async def get_note(db: AsyncSession, note_id: int) -> NoteModel:
        """
        Get a note by its ID.

        Args:
            db: The database session.
            note_id: The ID of the note to get.

        Returns:
            The note with the given ID.
        """
        query = select(NoteModel).where(NoteModel.id == note_id)
        result = await db.exec(query)
        return result.one()


note_crud = NoteCRUD()

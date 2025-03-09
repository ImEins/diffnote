from sqlalchemy.exc import SQLAlchemyError
from sqlmodel.ext.asyncio.session import AsyncSession

from src.common.exceptions import DatabaseError, NotFoundException

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
        try:
            db.add(note)
            await db.commit()
            await db.refresh(note)

            return note
        except SQLAlchemyError as e:
            await db.rollback()
            raise DatabaseError(message=str(e))

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
        try:
            note = await db.get(NoteModel, note_id)

            if note is None:
                raise NotFoundException(message='Note not found', data={'note_id': note_id})

            return note
        except SQLAlchemyError as e:
            raise DatabaseError(message=str(e))

    @staticmethod
    async def update_note(db: AsyncSession, note_id: int, updated_note: NoteModel) -> NoteModel:
        """
        Update a note by its ID.

        Args:
            db: The database session.
            note_id: The ID of the note to update.
            updated_note: The new note data.

        Returns:
            The updated note.
        """
        try:
            existing_note = await NoteCRUD.get_note(db, note_id)

            existing_note.title = updated_note.title
            existing_note.content = updated_note.content

            await db.commit()
            await db.refresh(existing_note)

            return existing_note
        except SQLAlchemyError as e:
            await db.rollback()
            raise DatabaseError(message=str(e))

    @staticmethod
    async def delete_note(db: AsyncSession, note_id: int) -> None:
        """
        Delete a note by its ID.

        Args:
            db: The database session.
            note_id: The ID of the note to delete.

        """
        try:
            note = await NoteCRUD.get_note(db, note_id)
            await db.delete(note)
            await db.commit()
        except SQLAlchemyError as e:
            await db.rollback()
            raise DatabaseError(message=str(e))


note_crud = NoteCRUD()

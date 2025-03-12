from typing import Any

from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import desc, select
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel.sql.expression import SelectOfScalar

from src.common.exceptions import DatabaseError, NotFoundException

from ..crud import note_crud
from .model import NoteVersion as NoteVersionModel


class NoteVersionCRUD:
    """
    CRUD operations for the NoteVersion model.
    """

    @staticmethod
    async def create_note_version(db: AsyncSession, note_version: NoteVersionModel) -> NoteVersionModel:
        """
        Create a new note version.
        We need to get the last version for the note and increment the version number.
        """
        try:
            last_version = (
                await db.exec(
                    select(NoteVersionModel)
                    .where(NoteVersionModel.note_id == note_version.note_id)
                    .order_by(desc(NoteVersionModel.created_at))
                    .limit(1)
                )
            ).one_or_none()

            note_version.version_number = last_version.version_number + 1 if last_version else 1

            db.add(note_version)
            await db.commit()
            await db.refresh(note_version)
            return note_version
        except SQLAlchemyError as e:
            raise DatabaseError(message=str(e))

    @staticmethod
    async def get_note_version(db: AsyncSession, note_id: int, version_id: int) -> NoteVersionModel:
        """
        Get a note version by note ID and version ID.
        We call which is a note_crud.get_note to ensure the note exists (may raise NotFoundException)
        If we get this far, we know the note exists, so we can safely get the version
        """
        try:
            await note_crud.get_note(db, note_id)

            note_version = await db.get(NoteVersionModel, version_id)

            if not note_version:
                raise NotFoundException(
                    message='Note version not found', data={'note_id': note_id, 'version_id': version_id}
                )

            return note_version
        except SQLAlchemyError as e:
            raise DatabaseError(message=str(e))

    @staticmethod
    async def get_note_versions(db: AsyncSession, note_id: int) -> SelectOfScalar[Any]:
        """
            Get all note versions for a note
            We call which is a note_crud.get_note to ensure the note exists (may raise NotFoundException)
            If we get this far, we know the note exists, so we can safely get the versions

        Args:
            db: Database session
            note_id: The ID of the note to get versions for

        Returns:
            SQLModel select query for note versions
        """

        try:
            await note_crud.get_note(db, note_id)

            return (
                select(NoteVersionModel)
                .where(NoteVersionModel.note_id == note_id)
                .order_by(desc(NoteVersionModel.created_at))
            )
        except SQLAlchemyError as e:
            raise DatabaseError(message=str(e))


note_version_crud = NoteVersionCRUD()

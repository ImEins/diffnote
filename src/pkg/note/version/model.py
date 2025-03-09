from typing import TYPE_CHECKING, Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from src.utils.mixin import TimeStampMixin

if TYPE_CHECKING:
    from ..model import NoteModel as Note


class NoteVersionModel(SQLModel, TimeStampMixin, table=True):
    id: int | None = Field(default=None, primary_key=True)
    version_number: int
    content: dict[str, Any] = Field(sa_column=Column(JSONB))

    # Foreign keys
    note_id: int = Field(foreign_key='note.id')

    # Relationships
    note: 'Note' = Relationship(back_populates='versions', sa_relationship_kwargs={'lazy': 'selectin'})

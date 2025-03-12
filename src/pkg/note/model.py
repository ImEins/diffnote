from typing import TYPE_CHECKING, Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel, String

from src.utils.mixin import TimeStampMixin

if TYPE_CHECKING:
    from .version.model import NoteVersion


class Note(SQLModel, TimeStampMixin, table=True):
    id: int = Field(primary_key=True)
    title: str = Field(sa_column=Column(String(255)))
    content: dict[str, Any] = Field(sa_column=Column(JSONB))

    # Relationships
    versions: list['NoteVersion'] = Relationship(
        back_populates='note', sa_relationship_kwargs={'lazy': 'selectin', 'cascade': 'all, delete'}
    )

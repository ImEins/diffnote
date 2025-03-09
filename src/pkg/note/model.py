from typing import TYPE_CHECKING, Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from src.utils.mixin import TimeStampMixin

if TYPE_CHECKING:
    from .version.model import NoteVersionModel as NoteVersion


class NoteModel(SQLModel, TimeStampMixin, table=True):
    id: int = Field(primary_key=True)
    title: str
    content: dict[str, Any] = Field(sa_column=Column(JSONB))

    # Relationships
    versions: list['NoteVersion'] = Relationship(back_populates='note', sa_relationship_kwargs={'lazy': 'selectin'})

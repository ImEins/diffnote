from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel


if TYPE_CHECKING:
    from ..model import Note


class NoteVersion(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    version_number: int = Field(default=1)
    content: dict[str, Any] = Field(sa_column=Column(JSONB))

    # Timestamps
    created_at: datetime = Field(
        description='Creation time',
        default_factory=datetime.now,
        sa_column=Column(DateTime(timezone=True), default=datetime.now(timezone.utc)),
    )

    # Foreign keys
    note_id: int = Field(foreign_key='note.id')

    # Relationships
    note: 'Note' = Relationship(back_populates='versions', sa_relationship_kwargs={'lazy': 'joined'})

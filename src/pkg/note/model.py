from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any

from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel, String

if TYPE_CHECKING:
    from .version.model import NoteVersion


class Note(SQLModel, table=True):
    id: int = Field(primary_key=True)
    title: str = Field(sa_column=Column(String(255)), default='Untitled')
    content: dict[str, Any] = Field(sa_column=Column(JSONB))

    # Timestamps
    created_at: datetime = Field(
        description='Creation time',
        default_factory=datetime.now,
        sa_column=Column(DateTime(timezone=True), default=datetime.now(timezone.utc)),
    )
    updated_at: datetime | None = Field(
        description='Update time',
        sa_column=Column(DateTime(timezone=True), onupdate=datetime.now(timezone.utc)),
        default_factory=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    versions: list['NoteVersion'] = Relationship(
        back_populates='note', sa_relationship_kwargs={'lazy': 'selectin', 'cascade': 'all, delete'}
    )

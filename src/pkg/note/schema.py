import json

from datetime import datetime
from typing import Any

from pydantic import field_validator
from sqlmodel import Field

from src.common.schemas import BaseSchema


class NoteBaseSchema(BaseSchema):
    """
    Base schema for a note.
    The content will be parsed into a dict at validation time if it's a string.
    """

    title: str | None = Field(default='Untitled')
    content: str | dict[str, Any]

    @field_validator('content')
    def validate_content(cls, v: str | dict[str, Any]) -> dict[str, Any]:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return {'text': v}
        return v


class NoteCreateSchema(NoteBaseSchema):
    pass


class NoteUpdateSchema(NoteBaseSchema):
    pass


class NoteResponseSchema(NoteBaseSchema):
    id: int
    created_at: datetime
    updated_at: datetime

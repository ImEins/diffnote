import json

from datetime import datetime
from typing import Any

from pydantic import field_validator

from src.common.schemas import BaseSchema


class NoteVersionBaseSchema(BaseSchema):
    """
    Base schema for a note version.
    The content will be parsed into a dict at validation time if it's a string.
    """

    content: str | dict[str, Any]
    note_id: int

    @field_validator('content')
    def validate_content(cls, v: str | dict[str, Any]) -> dict[str, Any]:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return {'text': v}
        return v


class NoteVersionCreateSchema(NoteVersionBaseSchema):
    pass


class NoteVersionResponseSchema(NoteVersionBaseSchema):
    id: int
    version_number: int
    created_at: datetime


# Unused, keeping here for reference
#
# class DiffResponseSchema(BaseSchema):
#     """Schema for representing differences between versions"""

#     additions: list[str]
#     deletions: list[str]
#     version_number: int
#     created_at: datetime

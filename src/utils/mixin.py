from datetime import datetime

from sqlmodel import Field


class TimeStampMixin:
    created_at: datetime = Field(
        exclude=True,
        description='Creation time',
        default_factory=datetime.now,
    )
    updated_at: datetime | None = Field(
        exclude=True,
        description='Update time',
        sa_column_kwargs={'onupdate': datetime.now},
        default_factory=datetime.now,
    )

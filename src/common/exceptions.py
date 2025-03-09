from typing import Any

from fastapi import status


class BaseExceptionMixin(Exception):
    """Base exception mixin"""

    code: int

    def __init__(self, message: str | None = None, data: Any = None, code: int | None = None):
        self.message = message
        self.data = data


class DatabaseConnectionError(BaseExceptionMixin):
    """Database connection error"""

    code = status.HTTP_500_INTERNAL_SERVER_ERROR
    message = 'Database connection error'

    def __init__(self, message: str | None = None, data: Any = None, code: int | None = None):
        super().__init__(message, data, code)

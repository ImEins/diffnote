from typing import Any, Callable, cast

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException

from src.common.exceptions import BaseExceptionMixin
from src.common.log import log
from src.common.schemas import response_base


async def base_exception_handler(request: Request, exc: BaseExceptionMixin) -> JSONResponse:
    """
    Handle custom exceptions derived from BaseExceptionMixin.

    Args:
        request: The request that caused the exception
        exc: The exception instance

    Returns:
        A JSON response with appropriate status code and error details
    """
    log.error(f'Custom exception: {exc.__class__.__name__}, Message: {exc.message}')

    response = await response_base.fail(code=exc.code, msg=exc.message or str(exc.__class__.__name__), data=exc.data)

    return JSONResponse(status_code=exc.code, content=response.model_dump())


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """
    Handle HTTP exceptions.

    Args:
        request: The request that caused the exception
        exc: The exception instance

    Returns:
        A JSON response with appropriate status code and error details
    """
    log.error(f'HTTP exception: {exc.status_code}, Detail: {exc.detail}')

    response = await response_base.fail(code=exc.status_code, msg=exc.detail)

    return JSONResponse(
        status_code=exc.status_code, content=response.model_dump(), headers=getattr(exc, 'headers', None)
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError | ValidationError) -> JSONResponse:
    """
    Handle validation errors from request data.

    Args:
        request: The request that caused the exception
        exc: The exception instance

    Returns:
        A JSON response with validation error details
    """
    errors = exc.errors()
    log.error(f'Validation error: {errors}')

    # Extract the first error for a more user-friendly message
    if errors:
        error = errors[0]
        if error.get('type') == 'json_invalid':
            message = 'JSON parsing failed'
        else:
            field = str(error.get('loc', ['unknown'])[-1])
            error_msg = error.get('msg', 'Invalid value')
            message = f'{field} {error_msg}'
    else:
        message = 'Validation error'

    # Sanitize errors "least privilege"
    sanitized_errors = [{'loc': err.get('loc'), 'msg': err.get('msg')} for err in errors]

    response = await response_base.fail(
        code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        msg=f'Invalid request parameters: {message}',
        data={'errors': sanitized_errors},
    )

    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=response.model_dump())


async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    """
    Handle SQLAlchemy database errors.

    Args:
        request: The request that caused the exception
        exc: The exception instance

    Returns:
        A JSON response with database error details
    """
    log.error(f'Database error: {str(exc)}')

    response = await response_base.fail(
        code=status.HTTP_500_INTERNAL_SERVER_ERROR, msg='An error occurred while processing the request.'
    )

    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=response.model_dump())


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Handle all other unhandled exceptions.

    Args:
        request: The request that caused the exception
        exc: The exception instance

    Returns:
        A JSON response with generic error information
    """
    log.error(f'Unhandled exception: {exc.__class__.__name__}, Message: {str(exc)}')

    response = await response_base.fail(code=status.HTTP_500_INTERNAL_SERVER_ERROR, msg='Internal server error')

    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=response.model_dump())


def register_exception_handlers(app: FastAPI) -> None:
    """
    Register all exception handlers with the FastAPI application.

    Args:
        app: The FastAPI application instance
    """
    # Register handlers for specific exception types
    app.add_exception_handler(BaseExceptionMixin, cast(Callable[..., Any], base_exception_handler))
    app.add_exception_handler(HTTPException, cast(Callable[..., Any], http_exception_handler))
    app.add_exception_handler(RequestValidationError, cast(Callable[..., Any], validation_exception_handler))
    app.add_exception_handler(ValidationError, cast(Callable[..., Any], validation_exception_handler))
    app.add_exception_handler(SQLAlchemyError, cast(Callable[..., Any], sqlalchemy_exception_handler))

    # Catch-all handler for any unhandled exceptions
    app.add_exception_handler(Exception, cast(Callable[..., Any], general_exception_handler))

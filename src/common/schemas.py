import asyncio

from typing import Any, Generic, Sequence, TypeVar

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

_ExcludeData = set[int | str] | dict[int | str, Any]

# Generic model data for response
T = TypeVar('T')


class BaseSchema(BaseModel):
    """Base schema class with ORM mode enabled for all schemas."""

    model_config = {'from_attributes': True}


class PaginationSchema(BaseModel, Generic[T]):
    """
    Pagination schema

    .. tip::

        This schema is used to paginate the data.
    """

    items: Sequence[T]
    total: int
    page: int
    size: int
    total_pages: int
    links: dict[str, str | None]


class ResponseModel(BaseModel, Generic[T]):
    """
    Unified response model

    .. tip::

        If you don't want to use the custom encoder in ResponseBase, you can use this model.
        The return data will be automatically parsed and returned through FastAPI's internal encoder.

    E.g. ::

        @router.get('/test', response_model=ResponseModel)
        def test():
            return ResponseModel(data={'test': 'test'})

        @router.get('/test')
        def test() -> ResponseModel:
            return ResponseModel(data={'test': 'test'})
    """

    # model_config = ConfigDict(json_encoders={datetime: lambda x: x.strftime(settings.DATETIME_FORMAT)})

    code: int = 200
    msg: str = 'Success'
    data: T | None = None


class ResponseBase:
    """
    Unified response methods

    .. tip::

        The return methods in this class will be pre-parsed through a custom encoder,
        then processed and returned by FastAPI's internal encoder. This may result in
        performance overhead, use based on personal preference.

    E.g. ::

        @router.get('/test')
        def test():
            return await response_base.success(data={'test': 'test'})
    """

    @staticmethod
    async def __json_encoder(data: Any, exclude: Any | None = None, **kwargs: Any) -> Any:
        # custom_encoder = {datetime: lambda x: x.strftime(settings.DATETIME_FORMAT)}
        # kwargs.update({'custom_encoder': custom_encoder})

        def _encode():
            return jsonable_encoder(data, exclude=exclude, **kwargs)

        return await asyncio.to_thread(_encode)

    async def success(
        self,
        *,
        code: int = 200,
        msg: str = 'Success',
        data: Any | None = None,
        exclude: _ExcludeData | None = None,
        **kwargs: Any,
    ) -> ResponseModel[Any]:
        """
        Generic method for successful response

        :param code: Response status code
        :param msg: Response message
        :param data: Response data
        :param exclude: Fields to exclude from response data
        :return:
        """
        data = data if data is None else await self.__json_encoder(data, exclude, **kwargs)
        return ResponseModel(code=code, msg=msg, data=data)

    async def fail(
        self,
        *,
        code: int = 400,
        msg: str = 'Bad Request',
        data: Any = None,
        exclude: _ExcludeData | None = None,
        **kwargs: Any,
    ) -> ResponseModel[Any]:
        data = data if data is None else await self.__json_encoder(data, exclude, **kwargs)
        return ResponseModel(code=code, msg=msg, data=data)


response_base = ResponseBase()

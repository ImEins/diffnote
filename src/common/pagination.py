from __future__ import annotations

import math

from typing import TYPE_CHECKING, Any, Dict, Generic, Sequence, TypeVar

from fastapi import Depends, Query
from fastapi_pagination import pagination_ctx
from fastapi_pagination.bases import AbstractPage, AbstractParams, RawParams
from fastapi_pagination.ext.sqlmodel import paginate
from fastapi_pagination.links.bases import create_links
from pydantic import BaseModel

if TYPE_CHECKING:
    from sqlmodel.ext.asyncio.session import AsyncSession
    from sqlmodel.sql.expression import SelectOfScalar

T = TypeVar('T')
DataT = TypeVar('DataT')
SchemaT = TypeVar('SchemaT')


class _Params(BaseModel, AbstractParams):
    page: int = Query(1, ge=1, description='Page number')
    size: int = Query(20, gt=0, le=100, description='Page size')  # Default 20 records

    def to_raw_params(self) -> RawParams:
        return RawParams(
            limit=self.size,
            offset=self.size * (self.page - 1),
        )


class _Page(AbstractPage[T], Generic[T]):
    items: Sequence[T]  # Data
    total: int  # Total number of records
    page: int  # Current page number
    size: int  # Records per page
    total_pages: int  # Total number of pages
    links: Dict[str, str | None]  # Navigation links

    __params_type__ = _Params  # Use custom Params

    @classmethod
    def create(
        cls,
        items: Sequence[T],
        total: int,
        params: _Params,
    ) -> _Page[T]:
        page = params.page
        size = params.size
        total_pages = math.ceil(total / params.size)

        # last when total = 0: points to page 1
        # next when at the last page: points to page = total_pages
        # prev when at the first page: points to page 1
        links_dict = {
            'first': {'page': '1', 'size': str(size)},
            'last': {'page': str(math.ceil(total / size)), 'size': str(size)}
            if total > 0
            else {'page': '1', 'size': str(size)},
            'next': {'page': str(page + 1), 'size': str(size)}
            if page + 1 <= total_pages
            else {'page': str(total_pages), 'size': str(size)},
            'prev': {'page': str(page - 1), 'size': str(size)} if page - 1 >= 1 else {'page': '1', 'size': str(size)},
        }

        links = create_links(**links_dict).model_dump()

        return cls(
            items=items,
            total=total,
            page=params.page,
            size=params.size,
            total_pages=total_pages,
            links=links,
        )


class _PageData(BaseModel, Generic[DataT]):
    page_data: DataT | None = None


async def paging_data(db: AsyncSession, select: SelectOfScalar[Any], page_data_schema: Any) -> dict[str, Any]:
    """
    Create paginated data based on SQLModel

    :param db: Database session
    :param select: SQLModel select statement
    :param page_data_schema: Pydantic model class for the page data
    :return: Dictionary containing pagination data
    """
    _paginate = await paginate(db, select)
    page_data = _PageData[_Page[page_data_schema]](page_data=_paginate).model_dump()['page_data']
    return page_data


# Pagination dependency injection
DependsPagination = Depends(pagination_ctx(_Page))

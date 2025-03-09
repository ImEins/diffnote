import pytest

from sqlmodel import func, select

from src.core.database import get_session


@pytest.mark.asyncio
async def test_database_connection():
    """
    Test that we can connect to the database.
    """
    # Get a database session
    session_generator = get_session()
    db = await anext(session_generator)

    try:
        # Simply check that we can get a session
        assert db is not None, 'Failed to get database session'
    finally:
        # Clean up
        try:
            await session_generator.aclose()
        except:
            pass


@pytest.mark.asyncio
async def test_database_query():
    """
    Test that we can execute a simple query.
    """
    # Get a database session
    session_generator = get_session()
    db = await anext(session_generator)

    try:
        # Execute a simple query to get current timestamp
        result = await db.exec(select(func.now()))
        timestamp = result.one()

        # Verify we got a result
        assert timestamp is not None, 'Database query failed to return a timestamp'

        # Execute another simple query
        result = await db.exec(select(1).where(True))
        value = result.one()

        # Verify we got the expected result
        assert value == 1, 'Database query failed to return expected value'
    finally:
        # Clean up
        try:
            await session_generator.aclose()
        except:
            pass

from src.core.database import AsyncSessionDI


class DatabaseSession:
    """
    Dependency for the database session, used to inject the database session into the service.

    Args:
        db_session: The database session.
    """

    def __init__(self, db_session: AsyncSessionDI):
        self.db_session = db_session

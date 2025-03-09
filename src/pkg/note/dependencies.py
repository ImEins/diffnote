from src.core.database import AsyncSessionDI


class DatabaseSession:
    def __init__(self, db_session: AsyncSessionDI):
        self.db_session = db_session

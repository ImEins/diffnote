from .model import Note
from .router import router as note_router
from .version.model import NoteVersion
from .version.router import router as version_router

__models__ = [Note, NoteVersion]
__all__ = ['note_router', 'version_router']

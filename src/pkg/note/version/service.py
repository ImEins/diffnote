from typing import Annotated, Any

from fastapi import Depends
from sqlmodel.sql.expression import SelectOfScalar

from ..dependencies import DatabaseSession
from .crud import note_version_crud
from .model import NoteVersion as NoteVersionModel
from .schema import NoteVersionCreateSchema, NoteVersionResponseSchema


class NoteVersionService(DatabaseSession):
    """
    Service for the NoteVersion model.
    """

    async def create_note_version(self, note_version: NoteVersionCreateSchema) -> NoteVersionResponseSchema:
        """
        Create a new note version.
        """
        note_version_data = note_version.model_dump()
        db_note_version = NoteVersionModel(**note_version_data)

        note_version_model = await note_version_crud.create_note_version(self.db_session, db_note_version)

        return NoteVersionResponseSchema.model_validate(note_version_model)

    async def get_note_versions(self, note_id: int) -> SelectOfScalar[Any]:
        """
        Get all note versions for a note.
        """
        note_versions = await note_version_crud.get_note_versions(self.db_session, note_id=note_id)

        return note_versions

    # Google diff-match-patch isn't maintained anymore (6 years last commit)
    # And there is no stubs for it. Implemented diff-match-patch-es as a drop in replacement in the frontend
    # Keeping this here for reference
    #
    # async def compare_versions(self, note_id: int, from_version: int, to_version: int) -> DiffResponseSchema:
    #     """
    #     Compare two versions of a note.
    #     """
    #     version_from = await note_version_crud.get_note_version(self.db_session, note_id, from_version)
    #     version_to = await note_version_crud.get_note_version(self.db_session, note_id, to_version)

    #     # Ensure content is in dictionary format
    #     from_content = version_from.content
    #     to_content = version_to.content

    #     # Convert JSONB content to string for comparison
    #     from_content_str = json.dumps(from_content, sort_keys=True)
    #     to_content_str = json.dumps(to_content, sort_keys=True)

    #     try:
    #         # Try to import diff-match-patch
    #         import diff_match_patch as dmp_module

    #         dmp = dmp_module.diff_match_patch()

    #         # Use diff-match-patch to compute differences on the JSON string representation
    #         diffs = dmp.diff_main(from_content_str, to_content_str)
    #         dmp.diff_cleanupSemantic(diffs)

    #         # Process the diffs into a more readable format
    #         additions = []
    #         deletions = []

    #         for op, text in diffs:
    #             if op == 1:  # Addition
    #                 additions.append(text)
    #             elif op == -1:  # Deletion
    #                 deletions.append(text)

    #     except ImportError:
    #         # Fallback to a simple diff implementation if the library is not available
    #         additions = []
    #         deletions = []

    #         # Use Python's difflib for a line-by-line diff
    #         import difflib

    #         from_lines = from_content_str.splitlines()
    #         to_lines = to_content_str.splitlines()

    #         diff = list(difflib.unified_diff(from_lines, to_lines))

    #         for line in diff:
    #             if line.startswith('+') and not line.startswith('+++'):
    #                 additions.append(line[1:])
    #             elif line.startswith('-') and not line.startswith('---'):
    #                 deletions.append(line[1:])

    #     return DiffResponseSchema(
    #         additions=additions, deletions=deletions, version_number=to_version, created_at=version_to.created_at
    #     )


NoteVersionServiceDI = Annotated[NoteVersionService, Depends(NoteVersionService)]

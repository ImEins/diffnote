import { HTTPValidationError } from "@/gen/models/hTTPValidationError";
import { NoteCreateSchema } from "@/gen/models/noteCreateSchema";
import type { NoteResponseSchema } from "@/gen/models/noteResponseSchema";
import { NoteUpdateSchema } from "@/gen/models/noteUpdateSchema";
import { ResponseModelNoteResponseSchema } from "@/gen/models/responseModelNoteResponseSchema";
import { ErrorType } from "@/lib/axios";
import { UseMutationResult } from "@tanstack/react-query";
import React, { createContext } from "react";

interface NotesContextProps {
  // All notes
  notes: NoteResponseSchema[];

  // Loading state
  isLoading: boolean;

  // Error state
  error: unknown;

  // Action to refetch notes
  refetchNotes: () => void;

  // Selected note and action to set it
  selectedNote: NoteResponseSchema | null;
  setSelectedNote: (note: NoteResponseSchema | null) => void;

  // Create note mutation
  createNoteMutation: UseMutationResult<
    ResponseModelNoteResponseSchema,
    ErrorType<HTTPValidationError>,
    { data: NoteCreateSchema },
    unknown
  >;

  // Update note mutation
  updateNoteMutation: UseMutationResult<
    ResponseModelNoteResponseSchema,
    ErrorType<HTTPValidationError>,
    { noteId: number; data: NoteUpdateSchema },
    unknown
  >;

  // Delete note mutation
  deleteNoteMutation: UseMutationResult<
    ResponseModelNoteResponseSchema,
    ErrorType<HTTPValidationError>,
    { noteId: number },
    unknown
  >;
}

/**
 * Create notes context
 * @returns The notes context
 */
export const NotesContext = createContext<NotesContextProps | undefined>(undefined)

/**
 * Use notes context hook
 * @returns The notes context
 */
export const useNotes = () => {
  const context = React.useContext(NotesContext)
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
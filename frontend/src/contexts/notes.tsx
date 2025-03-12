import { getGetNotesQueryKey, useCreateNote, useDeleteNote, useGetNotes, useUpdateNote } from '@/gen/endpoints/diffNote'
import type { NoteResponseSchema } from '@/gen/models/noteResponseSchema'
import useLocalStorage from '@/hooks/use-local-storage'
import { NotesContext } from '@/hooks/use-notes'
import { useQueryClient } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { toast } from 'sonner'

interface NotesProviderProps {
	children: ReactNode
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
	/*
	 * React query client
	 */
	const queryClient = useQueryClient()

	/*
	 * Get all notes
	 */
	const { data, isLoading, error, refetch: refetchNotes } = useGetNotes()
	const notes = [...(data?.data?.items || [])]

	/*
	 * Selected Note state with local storage
	 */
	const [selectedNote, setSelectedNote] = useLocalStorage<NoteResponseSchema | null>(
		'lastOpenedNote',
		notes.length > 0 ? notes[0] : null
	)

	/*
	 * Ready to use mutations
	 */
	const createNoteMutation = useCreateNote({
		mutation: {
			onSuccess: data => {
				setSelectedNote(data?.data || null)
				queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() })
			},
			onError: () => {
				toast.error('Unable to create note, please try again.')
			},
		},
	})

	const updateNoteMutation = useUpdateNote({
		mutation: {
			onSuccess: data => {
				setSelectedNote(data?.data || null)
				queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() })
			},
			onError: () => {
				toast.error('Unable to update note, please try again.')
			},
		},
	})

	const deleteNoteMutation = useDeleteNote({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getGetNotesQueryKey() })

				const filteredNotes = notes.filter(n => n.id !== selectedNote?.id)
				setSelectedNote(filteredNotes.length > 0 ? filteredNotes[0] : null)
			},
			onError: () => {
				toast.error('Unable to delete note, please try again.')
			},
		},
	})

	/*
	 * Render
	 */
	return (
		<NotesContext.Provider
			value={{
				notes,
				isLoading,
				error,
				refetchNotes,
				selectedNote,
				setSelectedNote,
				createNoteMutation,
				updateNoteMutation,
				deleteNoteMutation,
			}}
		>
			{children}
		</NotesContext.Provider>
	)
}

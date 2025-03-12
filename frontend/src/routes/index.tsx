import MainContent from '@/components/main-content'
import { Button } from '@/components/ui/button'
import { NoteEditor } from '@/features/note/components/note-editor'
import { useNotes } from '@/hooks/use-notes'
import { BlankTemplate } from '@/lib/tiptap'
import { createFileRoute } from '@tanstack/react-router'
import { RefreshCcw } from 'lucide-react'

export const Route = createFileRoute('/')({
	component: WorkspaceComponent,
})

function WorkspaceComponent() {
	/*
	 * Notes context
	 */
	const { selectedNote, createNoteMutation, error, refetch, isLoading } = useNotes()

	/*
	 * Render with isLoading or error
	 * OR the note editor if selectedNote is set
	 * OR the main content (welcome message) if none of them
	 */

	if (isLoading) {
		return (
			<div className="flex flex-col w-full h-full justify-center items-center">
				<RefreshCcw className="size-10 animate-spin opacity-10" />
			</div>
		)
	}

	if (error) {
		return (
			<MainContent title="An error occurred">
				<div className="flex items-center gap-x-2">
					<p>Unable to load notes, try again </p>
					<Button variant="outline" size="icon" onClick={refetch}>
						<RefreshCcw className="size-4" />
					</Button>
				</div>
			</MainContent>
		)
	}

	if (selectedNote) {
		return <NoteEditor key={selectedNote.id} selectedNote={selectedNote} />
	}

	return (
		<MainContent title="Welcome to DiffNote">
			<div className="flex flex-col gap-y-2">
				<p>Create your first note to get started</p>
				<Button
					onClick={() =>
						createNoteMutation.mutateAsync({
							data: BlankTemplate,
						})
					}
					className="px-4 py-2 bg-primary text-white rounded-md"
				>
					Create Note
				</Button>
			</div>
		</MainContent>
	)
}

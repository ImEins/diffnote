import { SidebarRight } from '@/components/sidebar-right'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { Editor } from '@/features/editor/components'
import { Menu } from '@/features/editor/components/menu'
import { getGetNoteVersionsQueryKey, useCreateNoteVersion, useGetNoteVersions } from '@/gen/endpoints/diffNote'
import { NoteResponseSchema } from '@/gen/models/noteResponseSchema'
import { NoteResponseSchemaContent } from '@/gen/models/noteResponseSchemaContent'
import { NoteVersionResponseSchema } from '@/gen/models/noteVersionResponseSchema'
import { useNotes } from '@/hooks/use-notes'
import { compareContents, DiffResult } from '@/lib/diff'
import { Extensions } from '@/lib/tiptap'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { JSONContent, useEditor } from '@tiptap/react'
import { ArrowLeft, Eye, History } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
import VersionHistory from './version-history'

interface NoteEditorProps {
	selectedNote: NoteResponseSchema
}

export function NoteEditor({ selectedNote }: NoteEditorProps) {
	/*
	 * Query client
	 */
	const queryClient = useQueryClient()

	/*
	 * Editor state:
	 * 1. isSaving: Whether the note is being saved
	 * 2. isDirty: Whether the note has unsaved changes
	 * 3. title: The title of the note
	 * 4. content: The content of the note
	 * 5. showVersionHistory: Whether to show the version history sidebar
	 * 6. currentVersionId: The ID of the current selected version
	 * 7. diffResults: The diff results between the current version and the previous version
	 */
	const [isSaving, setIsSaving] = useState(false)
	const [isDirty, setIsDirty] = useState(false)
	const [title, setTitle] = useState(selectedNote.title || '')
	const [content, setContent] = useState<NoteResponseSchemaContent>(selectedNote.content)
	const [showVersionHistory, setShowVersionHistory] = useState(false)
	const [currentVersionId, setCurrentVersionId] = useState<number | null>(null)
	const [diffResults, setDiffResults] = useState<DiffResult>({
		additions: [],
		deletions: [],
		fromId: 'original',
		toId: 0,
	})

	/*
	 * Editor component initialization
	 */
	const editor = useEditor({
		extensions: Extensions,
		content: content,
		onUpdate: ({ editor }) => {
			if (handleContentChange) {
				// Prevent update loops by checking if this is a user-initiated change
				const newContent = editor.getJSON()

				handleContentChange(newContent)
			}
		},
		editorProps: {
			attributes: {
				class: 'focus:outline-none min-h-[200px] prose prose-sm sm:prose lg:prose-lg xl:prose-xl',
			},
		},
		autofocus: !!title && 'end',
		editable: true,
		parseOptions: {
			preserveWhitespace: 'full',
		},
	})

	/*
	 * Notes context
	 * We update note mutation when title or content changes
	 */
	const { updateNoteMutation } = useNotes()

	/*
	 * Sidebar context, we need to know if the sidebar is collapsed or not
	 * to adjust the padding of the main content
	 */
	const { state } = useSidebar()

	/*
	 * 1. Note versions query to get the versions of the note
	 * 2. Create note version mutation to create a new version of the note
	 */
	const { data: noteVersions } = useGetNoteVersions(Number(selectedNote.id))
	const createNoteVersionMutation = useCreateNoteVersion({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getGetNoteVersionsQueryKey(Number(selectedNote.id)) })

				toast.success('Version saved successfully.')
			},
		},
	})

	/*
	 * Debounced save after 500ms of inactivity (user is not typing)
	 */
	const debouncedSave = useDebouncedCallback(async (title: string, content: NoteResponseSchemaContent) => {
		if (!selectedNote) return

		setIsSaving(true)

		try {
			await updateNoteMutation.mutateAsync({
				noteId: selectedNote.id,
				data: { title, content },
			})

			setIsDirty(false)
		} finally {
			setIsSaving(false)
		}
	}, 500)

	/*
	 * Handle title change
	 */
	const handleTitleChange = (newTitle: string) => {
		setTitle(newTitle)
		setIsDirty(true)
		if (selectedNote) selectedNote.title = newTitle
		debouncedSave(newTitle, content)
	}

	/*
	 * Handle content change
	 */
	const handleContentChange = (newContent: JSONContent) => {
		// If we are in version history mode, we don't want to update the content
		if (currentVersionId) return

		setContent(newContent)
		setIsDirty(true)
		if (selectedNote) selectedNote.content = newContent
		debouncedSave(title, newContent)
	}

	/**
	 * Compare versions function - compares a selected version with the previous version
	 */
	const compareVersions = (versionId: number) => {
		if (!noteVersions?.data?.items || noteVersions.data.items.length === 0) {
			return
		}

		// Find the selected version in the list
		const versionsList = noteVersions.data.items
		const selectedVersionIndex = versionsList.findIndex(v => v.id === versionId)

		if (selectedVersionIndex === -1) {
			console.error('Selected version not found')
			return
		}

		// Get the selected version and previous version
		const selectedVersion = versionsList[selectedVersionIndex]
		const previousVersion = versionsList.find(v => v.version_number === selectedVersion.version_number - 1)

		// Determine the contents to compare
		const fromContent = previousVersion ? previousVersion.content : selectedNote.content
		const toContent = selectedVersion.content
		const fromId = previousVersion?.id || 'original'

		// Use the utility function to compare contents
		const result = compareContents(fromContent, toContent, fromId, selectedVersion.id)

		// Store the diff results
		setDiffResults(result)

		return result
	}

	// Calculate total edits for display
	const totalEdits = diffResults.additions.length + diffResults.deletions.length

	/*
	 * Handle version select, this when we select a version from the version history
	 * We set the editor to read-only and set the content to the selected version
	 */
	const handleVersionSelect = (version: NoteVersionResponseSchema) => {
		setCurrentVersionId(version.id)
		editor?.setOptions({ editable: false })
		editor?.commands.setContent(version.content)

		// Compare with previous version
		compareVersions(version.id)
	}

	/*
	 * Close version history mode, this when we close the version history sidebar
	 * We set the editor to editable and set the content to the current note content
	 */
	const closeVersionHistoryMode = () => {
		setCurrentVersionId(null)
		editor?.setOptions({ editable: true })
		editor?.commands.setContent(selectedNote.content)
		setShowVersionHistory(false)
	}

	/*
	 * Cancel debounced save when component unmounts
	 */
	useEffect(() => {
		return () => debouncedSave.cancel()
	}, [debouncedSave])

	/**
	 * Apply highlights to the editor content based on diff results
	 * TODO: Rework this to be a bit more efficient and work with mixed diffs
	 */
	const applyHighlights = (diffResults: DiffResult) => {
		const { additions, deletions } = diffResults

		// Clear existing content
		editor?.commands.clearContent()

		// Get the current version we're viewing
		const selectedVersion = noteVersions?.data?.items.find(v => v.id === currentVersionId)

		if (!selectedVersion) return

		// For additions-only diffs, we want to show just the added content with highlights
		if (additions.length > 0 && deletions.length === 0) {
			// Insert the base content
			editor?.commands.setContent(selectedVersion.content)

			// Add a visual marker for what was added
			editor?.commands.setTextSelection({ from: editor.state.doc.content.size, to: editor.state.doc.content.size })
			editor?.commands.insertContent([
				{
					type: 'paragraph',
					content: [{ type: 'text', text: '+' }],
				},
			])

			// Add additions with highlight
			editor?.commands.setHighlight({ color: '#AEFFA6' })
			additions.forEach(addition => {
				if (addition) {
					editor?.commands.insertContent(addition)
					editor?.commands.enter()
				}
			})
			editor?.commands.unsetHighlight()
		}
		// For deletions or mixed diffs
		else {
			// Add deletions in red
			if (deletions.length > 0) {
				editor?.commands.insertContent([
					{
						type: 'paragraph',
						content: [{ type: 'text', text: `- ` }],
					},
				])

				editor?.commands.setHighlight({ color: '#FE6263' })
				deletions.forEach(deletion => {
					if (deletion) {
						editor?.commands.insertContent(deletion)
						editor?.commands.enter()
					}
				})
				editor?.commands.unsetHighlight()
			}

			// Add additions in green
			if (additions.length > 0) {
				editor?.commands.insertContent([
					{
						type: 'paragraph',
						content: [{ type: 'text', text: `+ ` }],
					},
				])

				editor?.commands.setHighlight({ color: '#AEFFA6' })
				additions.forEach(addition => {
					if (addition) {
						editor?.commands.insertContent(addition)
						editor?.commands.enter()
					}
				})
				editor?.commands.unsetHighlight()
			}

			// Show the full content after the diff
			editor?.commands.insertContent([
				{
					type: 'heading',
					attrs: { level: 2 },
					content: [{ type: 'text', text: 'Full Content:' }],
				},
			])

			editor?.commands.insertContent(selectedVersion.content)
		}
	}

	/*
	 * Handle navigation through changes
	 */
	const handleDiffMode = () => {
		applyHighlights(diffResults)
	}

	/*
	 * Handle restore version
	 * We create a new version with the current content so make sure it's not lost
	 * Then we update the note with the previous version content
	 *
	 * TODO: Don't create a new version if the content is the same as the current version or empty
	 */
	const handleRestoreVersion = async () => {
		const versionContent = noteVersions?.data?.items.find(v => v.id === currentVersionId)?.content || ''

		await createNoteVersionMutation.mutateAsync({
			data: {
				note_id: selectedNote.id,
				content,
			},
		})

		await updateNoteMutation.mutateAsync({
			noteId: selectedNote.id,
			data: {
				title: selectedNote.title,
				content: versionContent,
			},
		})

		toast.success('Version restored successfully.')
	}

	/*
	 * Render
	 */
	return (
		<div className="h-full flex">
			<div className={cn('flex-1 w-3/4 mt-4', state === 'collapsed' ? 'pl-12 pr-4' : 'px-8')}>
				<div className="flex sticky top-0 bg-background z-10 justify-between items-center flex-col-reverse gap-y-4 xl:flex-row">
					{currentVersionId === null ? (
						<>
							<Menu editor={editor} />

							<div className="flex items-center gap-x-2">
								<div className="text-sm text-muted-foreground px-2">
									{isSaving || isDirty ? (
										<span className="animate-pulse">Saving...</span>
									) : selectedNote?.updated_at ? (
										`Last saved ${new Date(selectedNote.updated_at).toLocaleTimeString()}`
									) : null}
								</div>
								<Button
									variant="default"
									className={cn('text-xs', createNoteVersionMutation.isPending && 'animate-pulse')}
									size="sm"
									title="Commit version"
									onClick={() => {
										createNoteVersionMutation.mutateAsync({
											data: {
												note_id: selectedNote.id,
												content,
											},
										})
									}}
									disabled={createNoteVersionMutation.isPending}
								>
									Commit version
								</Button>
								<Button
									title="Note history"
									variant="secondary"
									size="icon"
									className="hover:bg-primary/5 shadow-none"
									onClick={() => setShowVersionHistory(!showVersionHistory)}
								>
									<History className="size-4" />
								</Button>
							</div>
						</>
					) : (
						<div className="flex items-center justify-between w-full">
							<Button variant="ghost" size="icon" className="hover:bg-primary/5" onClick={closeVersionHistoryMode}>
								<ArrowLeft className="size-4" />
							</Button>
							<div className="flex items-center gap-x-2">
								<span className="text-sm text-muted-foreground">Total: {totalEdits} edits </span>
								<Button
									title="Show diff"
									variant="ghost"
									size="icon"
									className="hover:bg-primary/5 shadow-none"
									onClick={handleDiffMode}
									disabled={totalEdits === 0}
								>
									<Eye className="size-4" />
								</Button>

								<Button
									variant="default"
									size="sm"
									className="text-xs"
									onClick={handleRestoreVersion}
									disabled={!currentVersionId}
								>
									Restore version
								</Button>
							</div>
						</div>
					)}
				</div>

				<Editor
					className="overflow-auto"
					key={selectedNote?.id}
					editor={editor}
					title={title}
					onTitleChange={handleTitleChange}
				/>
			</div>

			{showVersionHistory && (
				<div className="w-1/4 -pr-6">
					<SidebarRight
						header="Versions History"
						sidebarContent={
							<VersionHistory
								versions={noteVersions?.data?.items ?? []}
								onVersionSelect={handleVersionSelect}
								currentVersionId={currentVersionId}
							/>
						}
						onClose={closeVersionHistoryMode}
					/>
				</div>
			)}
		</div>
	)
}

import { Editor } from '@/features/editor/components'
import { NoteResponseSchema } from '@/gen/models/noteResponseSchema'
import { NoteResponseSchemaContent } from '@/gen/models/noteResponseSchemaContent'
import { useNotes } from '@/hooks/use-notes'
import { Extensions } from '@/lib/tiptap'
import { JSONContent, useEditor } from '@tiptap/react'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface NoteEditorProps {
	selectedNote: NoteResponseSchema
}

export function NoteEditor({ selectedNote }: NoteEditorProps) {
	/*
	 * Notes context
	 * We update note mutation when title or content changes
	 */
	const { updateNoteMutation } = useNotes()

	/*
	 * Editor state
	 * isSaving: Whether the note is being saved
	 * isDirty: Whether the note has unsaved changes
	 * title: The title of the note
	 * content: The content of the note
	 */
	const [isSaving, setIsSaving] = useState(false)
	const [isDirty, setIsDirty] = useState(false)
	const [title, setTitle] = useState(selectedNote.title || '')
	const [content, setContent] = useState<NoteResponseSchemaContent>(selectedNote.content)

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
		setContent(newContent)
		setIsDirty(true)
		if (selectedNote) selectedNote.content = newContent
		debouncedSave(title, newContent)
	}

	/*
	 * Cancel debounced save when component unmounts
	 */
	useEffect(() => {
		return () => debouncedSave.cancel()
	}, [debouncedSave])

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
	 * Render
	 */
	return (
		<div className="h-full flex flex-col">
			<Editor
				key={selectedNote?.id}
				editor={editor}
				title={title}
				onTitleChange={handleTitleChange}
				isSaving={isDirty || isSaving}
				lastSaved={selectedNote?.updated_at ? new Date(selectedNote.updated_at) : null}
			/>
		</div>
	)
}

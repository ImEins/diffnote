import { cn } from '@/lib/utils'
import { EditorContent, Editor as TiptapEditor } from '@tiptap/react'

interface TipTapEditorProps {
	editor: TiptapEditor | null
	title: string
	onTitleChange?: (title: string) => void
	className?: string
}

export function Editor({ editor, title, onTitleChange, className }: TipTapEditorProps) {
	return (
		<div className={cn('flex flex-col w-full', className)}>
			<div className="max-w-3xl w-full mx-auto">
				<div className="relative">
					<input
						value={title}
						onChange={e => {
							onTitleChange?.(e.target.value)
						}}
						className="outline-none text-4xl font-bold py-6 my-2 min-h-[60px] w-full placeholder:text-gray-400"
						placeholder="Untitled"
						autoFocus={title === ''}
					/>
				</div>

				<div className="relative">
					<EditorContent editor={editor} />
				</div>
			</div>
		</div>
	)
}

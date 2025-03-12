import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/react'
import {
	ALargeSmall,
	Bold as BoldIcon,
	Code as CodeIcon,
	Heading1,
	Heading2,
	Heading3,
	Italic as ItalicIcon,
	List,
	ListOrdered,
	Redo2,
	Strikethrough,
	Undo2,
} from 'lucide-react'

interface EditorMenuBarProps {
	editor: Editor | null
}

export function Menu({ editor }: EditorMenuBarProps) {
	if (!editor) {
		return null
	}

	return (
		<div className="flex gap-x-5">
			<div className="flex gap-x-4">
				<Button
					variant="ghost"
					size="icon"
					className="size-6"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
				>
					<Undo2 />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="size-6"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
				>
					<Redo2 />
				</Button>
			</div>

			<div>
				<Separator orientation="vertical" />
			</div>

			<div className="flex gap-x-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					className={cn(editor.isActive('bold') ? 'bg-gray-200 text-gray-800' : '', 'size-6')}
				>
					<BoldIcon />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					className={cn(editor.isActive('italic') ? 'bg-gray-200 text-gray-800' : '', 'size-6')}
				>
					<ItalicIcon />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
					className={cn(editor.isActive('strike') ? 'bg-gray-200 text-gray-800' : '', 'size-6')}
				>
					<Strikethrough />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => editor.chain().focus().toggleCode().run()}
					disabled={!editor.can().chain().focus().toggleCode().run()}
					className={cn(editor.isActive('code') ? 'bg-gray-200 text-gray-800' : '', 'size-6')}
				>
					<CodeIcon />
				</Button>
			</div>

			<div>
				<Separator orientation="vertical" />
			</div>

			<div className="flex gap-x-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="size-6">
							{editor.isActive('heading', { level: 1 }) ? (
								<Heading1 />
							) : editor.isActive('heading', { level: 2 }) ? (
								<Heading2 />
							) : editor.isActive('heading', { level: 3 }) ? (
								<Heading3 />
							) : (
								<ALargeSmall />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
							className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-gray-800' : ''}
						>
							<Heading1 /> <span className="text-xs">Heading 1</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
							className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-800' : ''}
						>
							<Heading2 /> <span className="text-xs">Heading 2</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
							className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-gray-800' : ''}
						>
							<Heading3 /> <span className="text-xs">Heading 3</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => editor.chain().focus().setParagraph().run()}
							className={editor.isActive('paragraph') ? 'bg-gray-200 text-gray-800' : ''}
						>
							<ALargeSmall /> <span className="text-xs">Paragraph</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div>
				<Separator orientation="vertical" />
			</div>

			<div className="flex gap-x-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={cn(editor.isActive('bulletList') ? 'bg-gray-200 text-gray-800' : '', 'size-6')}
				>
					<List />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={cn(editor.isActive('orderedList') ? 'bg-gray-200 text-gray-800' : '', 'size-6')}
				>
					<ListOrdered />
				</Button>
			</div>
		</div>
	)
}

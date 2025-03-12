import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar'
import useLocalStorage from '@/hooks/use-local-storage'
import { useNotes } from '@/hooks/use-notes'
import { BlankTemplate } from '@/lib/tiptap'
import { cn, extractTextFromContent } from '@/lib/utils'
import { LayoutGrid, LayoutList, Menu, Plus, SortAsc, SortDesc, Trash2 } from 'lucide-react'
import TimeAgo from 'timeago-react'
import { Skeleton } from './ui/skeleton'

function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
	/*
	 * Notes state from context
	 */
	const { notes, error, isLoading, selectedNote, setSelectedNote, createNoteMutation, deleteNoteMutation } = useNotes()

	/*
	 * Sidebar state
	 */
	const { state, toggleSidebar } = useSidebar()

	/*
	 * View mode and sort order state with local storage
	 */
	const [viewMode, setViewMode] = useLocalStorage<'list' | 'grid'>('viewMode', 'grid')
	const [sortOrder, setSortOrder] = useLocalStorage<'asc' | 'desc'>('sortOrder', 'asc')

	/*
	 * Toggle sort order
	 */
	const toggleSortOrder = () => {
		setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
	}

	/*
	 * Toggle view mode
	 */
	const toggleViewMode = () => {
		setViewMode(viewMode === 'list' ? 'grid' : 'list')
	}

	/*
	 * Handle note click
	 */
	const handleNoteClick = (noteId: number) => {
		const note = notes.find(n => n.id === noteId)
		if (note) {
			setSelectedNote(note)
		}
	}

	/*
	 * Render
	 */
	return (
		<>
			<div className={cn('absolute z-10 left-1 top-5', state !== 'collapsed' ? 'hidden' : '')}>
				<Button variant="ghost" size="icon" onClick={toggleSidebar}>
					<Menu />
				</Button>
			</div>

			<Sidebar collapsible="offcanvas" className="border-none" {...props}>
				<SidebarHeader className="p-0 px-4 mt-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Avatar>
								<AvatarFallback className="bg-orange-400 font-bold text-xs text-white">M</AvatarFallback>
							</Avatar>
							<h1 className="text-lg font-bold">Mehdi's Notes</h1>
						</div>

						<SidebarTrigger className={cn('hover:bg-primary/5', state === 'collapsed' ? 'hidden' : '')} />
					</div>

					<div className="mt-8 flex justify-between items-center">
						{isLoading ? (
							<Skeleton className="w-10 h-4" />
						) : (
							<p className="text-sm text-muted-foreground">{notes.length} Notes</p>
						)}
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="icon" onClick={toggleSortOrder} className="size-6 hover:bg-primary/5">
								{sortOrder === 'asc' ? <SortAsc /> : <SortDesc />}
							</Button>
							<Button variant="ghost" size="icon" onClick={toggleViewMode} className="size-6 hover:bg-primary/5">
								{viewMode === 'list' ? <LayoutList /> : <LayoutGrid />}
							</Button>
						</div>
					</div>

					<div className="mt-1 mb-2">
						<Button
							variant="secondary"
							className="w-full shadow-none"
							onClick={() =>
								createNoteMutation.mutateAsync({
									data: BlankTemplate,
								})
							}
							disabled={isLoading}
						>
							<Plus />
						</Button>
					</div>
				</SidebarHeader>

				<SidebarContent className="px-4 py-1">
					{isLoading ? (
						<Skeleton className="w-full h-42" />
					) : error ? (
						<p className="text-sm text-muted-foreground">Unable to load notes, please try again.</p>
					) : viewMode === 'list' ? (
						<div className="space-y-2">
							{notes.map(note => {
								const isSelected = selectedNote?.id === note.id
								const previewText = extractTextFromContent(note.content).trim().substring(0, 60)

								return (
									<div
										key={note.id}
										onClick={() => handleNoteClick(note.id)}
										className={cn(
											'flex flex-col py-2 px-3 hover:bg-accent rounded-md transition-colors cursor-pointer',
											isSelected ? 'bg-accent' : ''
										)}
									>
										<span className="text-sm font-medium">{note.title || 'Untitled'}</span>

										{/* Preview text */}
										<div className="flex justify-between items-center mt-1">
											<span className="text-xs text-muted-foreground line-clamp-1">{previewText || 'Empty note'}</span>
											<span className="text-xs text-muted-foreground">
												{note.updated_at ? new Date(note.updated_at).toLocaleDateString() : 'No date'}
											</span>
										</div>
									</div>
								)
							})}
						</div>
					) : (
						<div className="flex flex-col gap-y-4">
							{notes.map(note => {
								const isSelected = selectedNote?.id === note.id
								const previewText = extractTextFromContent(note.content).trim().substring(0, 150)

								return (
									<div key={note.id} onClick={() => handleNoteClick(note.id)} className="cursor-pointer">
										<Card
											className={cn(
												isSelected ? 'shadow-md ring-2 ring-primary' : 'shadow-none',
												'hover:translate-x-1 transition-transform duration-200 ease-in-out group/item'
											)}
										>
											<CardHeader className="flex flex-row justify-between items-center">
												<CardTitle className="text-base">{note.title || 'Untitled'}</CardTitle>
												<Button
													variant="ghost"
													size="icon"
													className="size-6 opacity-0 group-hover/item:opacity-50 hover:opacity-100 text-destructive hover:text-destructive-foreground"
													onClick={() => {
														deleteNoteMutation.mutateAsync({ noteId: note.id })
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</CardHeader>
											<CardContent>
												<p className="h-16 text-sm line-clamp-2 text-muted-foreground whitespace-pre-line">
													{previewText || 'No content'}
												</p>
											</CardContent>
											<CardFooter>
												<TimeAgo
													className="text-xs text-muted-foreground"
													datetime={new Date(note.updated_at || new Date().toISOString())}
												/>
											</CardFooter>
										</Card>
									</div>
								)
							})}
						</div>
					)}
				</SidebarContent>
				<SidebarRail />
			</Sidebar>
		</>
	)
}

export default SidebarLeft

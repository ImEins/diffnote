import * as React from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Sidebar } from '@/components/ui/sidebar'
import { X } from 'lucide-react'
import { Button } from './ui/button'

interface SidebarRightProps extends React.ComponentProps<typeof Sidebar> {
	header: string
	sidebarContent: React.ReactNode
	onClose: () => void
}

export function SidebarRight({ header, sidebarContent, onClose, ...props }: SidebarRightProps) {
	return (
		<div className="bg-background h-full border-l border-sidebar-border pt-5 sticky" {...props}>
			<div className="flex flex-col gap-y-8 px-4">
				<div className="flex justify-between items-center">
					<h3 className="text-lg font-bold">{header}</h3>
					<Button variant="ghost" size="icon" className="size-7 hover:bg-primary/5" onClick={onClose}>
						<X />
					</Button>
				</div>
				<ScrollArea className="h-full">{sidebarContent}</ScrollArea>
			</div>
		</div>
	)
}

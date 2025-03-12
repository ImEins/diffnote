import SidebarLeft from '@/components/sidebar-left'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { NotesProvider } from '@/contexts/notes'
import { ReactNode } from 'react'

interface RootLayoutProps {
	children: ReactNode
}

function RootLayout({ children }: RootLayoutProps) {
	return (
		<NotesProvider>
			<SidebarProvider>
				<SidebarLeft />
				<SidebarInset>{children}</SidebarInset>
			</SidebarProvider>

			<Toaster />
		</NotesProvider>
	)
}

export default RootLayout

interface MainContentProps {
	title: string
	children: React.ReactNode
}

function MainContent({ title, children }: MainContentProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full p-4">
			<h2 className="text-2xl font-bold mb-4">{title}</h2>
			<div className="text-muted-foreground mb-6">{children}</div>
		</div>
	)
}

export default MainContent

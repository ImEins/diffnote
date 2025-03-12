import { NoteVersionResponseSchema } from '@/gen/models/'
import { formatDateTime } from '@/lib/date'
import { cn, groupByDateCategory } from '@/lib/utils'

interface VersionHistoryProps {
	versions: NoteVersionResponseSchema[]
	onVersionSelect?: (version: NoteVersionResponseSchema) => void
	currentVersionId: number | null
}

function VersionHistory({ versions, onVersionSelect, currentVersionId }: VersionHistoryProps) {
	const groupedVersions = versions.length > 0 ? groupByDateCategory(versions) : {}

	return (
		<>
			{versions.length === 0 ? (
				<div className="text-sm text-muted-foreground">No version history</div>
			) : (
				<div className="space-y-5">
					{Object.entries(groupedVersions).map(([category, categoryVersions]) => (
						<div key={category}>
							<div className="text-xs text-muted-foreground mb-3">{category}</div>
							{categoryVersions.map(version => (
								<div
									key={version.id}
									className={cn(
										'p-2 my-2 cursor-pointer hover:bg-secondary/60 rounded-md'
										// version.id === currentVersionId && "bg-muted"
									)}
									onClick={() => onVersionSelect && onVersionSelect(version)}
								>
									<div className="text-sm">{formatDateTime(version.created_at)}</div>
									{version.id === currentVersionId && (
										<div className="text-xs text-muted-foreground italic">Current version</div>
									)}
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</>
	)
}

export default VersionHistory

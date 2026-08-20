import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'

export interface BreadcrumbProps {
	segments: string[]
}

export function Breadcrumb({ segments }: BreadcrumbProps) {
	return (
		<nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs">
			{segments.map((segment, index) => {
				const isLast = index === segments.length - 1

				return (
					<Fragment key={segment}>
						{index > 0 ? <ChevronRight className="size-3 text-muted-foreground" /> : null}
						<span
							className={
								isLast
									? 'font-bold tracking-wide text-foreground uppercase'
									: 'tracking-wide text-muted-foreground uppercase'
							}
						>
							{segment}
						</span>
					</Fragment>
				)
			})}
		</nav>
	)
}
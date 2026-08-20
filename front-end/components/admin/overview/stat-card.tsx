import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps, ReactNode } from 'react'

export interface StatCardProps extends ComponentProps<'div'> {
	label: string
	value: ReactNode
	trend?: {
		direction: 'up' | 'down' | 'neutral'
		text: string
	}
}

const trendIcon = {
	up: TrendingUp,
	down: TrendingDown,
	neutral: Minus,
} as const

const trendColor = {
	up: 'text-primary-hover',
	down: 'text-destructive',
	neutral: 'text-muted-foreground',
} as const

export function StatCard({ className, label, value, trend, ...props }: StatCardProps) {
	return (
		<div
			data-slot="stat-card"
			className={twMerge('rounded-xl border border-border bg-surface p-6', className)}
			{...props}
		>
			<span className="font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
				{label}
			</span>
			<p className="font-display mt-2 text-3xl font-bold text-foreground">{value}</p>
			{trend ? (
				<div className={twMerge('mt-2 flex items-center gap-1.5 text-xs', trendColor[trend.direction])}>
					{(() => {
						const Icon = trendIcon[trend.direction]
						return <Icon className="size-3.5" />
					})()}
					<span>{trend.text}</span>
				</div>
			) : null}
		</div>
	)
}
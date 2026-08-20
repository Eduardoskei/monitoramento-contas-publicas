import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export type CardProps = ComponentProps<'div'>

export function Card({ className, ...props }: CardProps) {
	return (
		<div
			data-slot="card"
			className={twMerge(
				'flex flex-col gap-6 rounded-xl border border-border bg-surface p-8 shadow-sm',
				className,
			)}
			{...props}
		/>
	)
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
	return <div data-slot="card-header" className={twMerge('flex flex-col gap-1.5', className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
	return (
		<h3
			data-slot="card-title"
			className={twMerge('font-display text-lg font-semibold text-foreground', className)}
			{...props}
		/>
	)
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
	return (
		<p
			data-slot="card-description"
			className={twMerge('text-sm text-foreground-subtle', className)}
			{...props}
		/>
	)
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
	return <div data-slot="card-content" className={twMerge('flex flex-col gap-6', className)} {...props} />
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-footer"
			className={twMerge('flex items-center justify-between border-t border-border pt-6', className)}
			{...props}
		/>
	)
}

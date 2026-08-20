import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const badgeVariants = tv({
	base: 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-wider',
	variants: {
		variant: {
			dark: 'border-white/15 bg-white/5 text-foreground-subtle',
			light: 'border-border-light bg-cream-raised text-ink-subtle',
		},
	},
	defaultVariants: { variant: 'dark' },
})

export interface BadgeProps
	extends ComponentProps<'div'>,
		VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
	return (
		<div data-slot="badge" className={twMerge(badgeVariants({ variant }), className)} {...props}>
			{children}
		</div>
	)
}
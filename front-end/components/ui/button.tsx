import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const buttonVariants = tv({
	base: [
		'inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium rounded-lg border transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
	],
	variants: {
		variant: {
			primary: 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover',
			outline: 'border-border-light bg-transparent text-inherit hover:bg-foreground/5',
			'outline-dark': 'border-white/25 bg-transparent text-foreground hover:bg-white/10',
			ghost: 'border-transparent bg-transparent text-muted-foreground hover:text-foreground',
		},
		size: {
			sm: 'h-8 px-3 gap-1.5 text-xs [&_svg]:size-3.5',
			md: 'h-11 px-5 gap-2 text-sm [&_svg]:size-4',
			lg: 'h-12 px-6 gap-2.5 text-base [&_svg]:size-4.5',
		},
	},
	defaultVariants: { variant: 'primary', size: 'md' },
})

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, disabled, children, ...props }: ButtonProps) {
	return (
		<button
			type="button"
			data-slot="button"
			data-disabled={disabled ? '' : undefined}
			className={twMerge(buttonVariants({ variant, size }), className)}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}
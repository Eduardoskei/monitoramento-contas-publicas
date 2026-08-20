import { twMerge } from 'tailwind-merge'
import type { ComponentProps, ReactNode } from 'react'
import { useId } from 'react'

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'id'> {
	label: string
	hint?: string
	error?: string
	required?: boolean
	icon?: ReactNode
	trailing?: ReactNode
	containerClassName?: string
}

export function TextField({
	label,
	hint,
	error,
	required,
	icon,
	trailing,
	className,
	containerClassName,
	...props
}: TextFieldProps) {
	const id = useId()
	const hintId = hint ? `${id}-hint` : undefined
	const errorId = error ? `${id}-error` : undefined

	return (
		<div data-slot="text-field" className={twMerge('flex flex-col gap-2', containerClassName)}>
			<label htmlFor={id} className="font-mono text-xs text-foreground-subtle">
				{label}
				{required ? <span className="ml-0.5 text-destructive">*</span> : null}
			</label>

			<div className="relative flex items-center">
				{icon ? (
					<span className="pointer-events-none absolute left-3 flex items-center text-foreground-subtle [&_svg]:size-4">
						{icon}
					</span>
				) : null}

				<input
					id={id}
					data-slot="text-field-input"
					data-invalid={error ? '' : undefined}
					aria-invalid={!!error}
					aria-describedby={errorId ?? hintId}
					className={twMerge(
						'h-11 w-full rounded-md border border-input bg-surface px-3.5 text-sm text-foreground placeholder:text-foreground-subtle/70',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
						'data-invalid:border-destructive data-invalid:focus-visible:ring-destructive',
						icon ? 'pl-9' : undefined,
						trailing ? 'pr-10' : undefined,
						className,
					)}
					{...props}
				/>

				{trailing ? <span className="absolute right-3 flex items-center">{trailing}</span> : null}
			</div>

			{error ? (
				<p id={errorId} className="text-xs text-destructive">
					{error}
				</p>
			) : hint ? (
				<p id={hintId} className="text-xs text-foreground-subtle">
					{hint}
				</p>
			) : null}
		</div>
	)
}

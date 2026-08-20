import { Select } from '@base-ui/react/select'
import { twMerge } from 'tailwind-merge'
import { ChevronDown, Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { useId } from 'react'

export interface SelectFieldOption {
	label: string
	value: string
}

export interface SelectFieldProps {
	label: string
	placeholder?: string
	required?: boolean
	icon?: ReactNode
	options: SelectFieldOption[]
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	error?: string
	className?: string
}

export function SelectField({
	label,
	placeholder = 'Select an option...',
	required,
	icon,
	options,
	value,
	defaultValue,
	onValueChange,
	error,
	className,
}: SelectFieldProps) {
	const id = useId()

	return (
		<div data-slot="select-field" className={twMerge('flex flex-col gap-2', className)}>
			<label htmlFor={id} className="font-mono text-xs text-foreground-subtle">
				{label}
				{required ? <span className="ml-0.5 text-destructive">*</span> : null}
			</label>

			<Select.Root
				items={options}
				value={value}
				defaultValue={defaultValue}
				onValueChange={(nextValue) => {
					if (nextValue !== null) onValueChange?.(nextValue)
				}}
			>
				<Select.Trigger
					id={id}
					data-slot="select-field-trigger"
					data-invalid={error ? '' : undefined}
					className={twMerge(
						'flex h-11 w-full items-center gap-2.5 rounded-md border border-input bg-surface px-3.5 text-sm text-foreground',
						'data-popup-open:ring-2 data-popup-open:ring-ring',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
						'data-invalid:border-destructive',
					)}
				>
					{icon ? <span className="flex items-center text-foreground-subtle [&_svg]:size-4">{icon}</span> : null}
					<Select.Value placeholder={placeholder} className="flex-1 text-left text-foreground-subtle data-has-value:text-foreground" />
					<Select.Icon className="flex items-center text-foreground-subtle">
						<ChevronDown className="size-4" />
					</Select.Icon>
				</Select.Trigger>

				<Select.Portal>
					<Select.Positioner sideOffset={6} className="z-50">
						<Select.Popup className="max-h-64 w-(--anchor-width) overflow-auto rounded-md border border-border bg-surface p-1 shadow-lg">
							{options.map((option) => (
								<Select.Item
									key={option.value}
									value={option.value}
									className={twMerge(
										'flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2.5 py-2 text-sm text-foreground',
										'data-highlighted:bg-muted',
									)}
								>
									<Select.ItemText>{option.label}</Select.ItemText>
									<Select.ItemIndicator className="flex items-center text-primary">
										<Check className="size-3.5" />
									</Select.ItemIndicator>
								</Select.Item>
							))}
						</Select.Popup>
					</Select.Positioner>
				</Select.Portal>
			</Select.Root>

			{error ? <p className="text-xs text-destructive">{error}</p> : null}
		</div>
	)
}

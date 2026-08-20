import { twMerge } from 'tailwind-merge'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

export interface StepperStep {
	label: string
	icon?: ReactNode
}

export interface StepperProps {
	steps: StepperStep[]
	currentStep: number
	align?: 'start' | 'center'
	className?: string
}

export function Stepper({ steps, currentStep, align = 'start', className }: StepperProps) {
	return (
		<ol
			data-slot="stepper"
			className={twMerge('flex w-full items-center', align === 'center' ? 'justify-center' : undefined, className)}
		>
			{steps.map((step, index) => {
				const state = index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming'

				return (
					<li key={step.label} className={twMerge('flex items-center', index < steps.length - 1 ? 'flex-1' : undefined)}>
						<div className="flex items-center gap-2.5">
							<span
								data-slot="stepper-icon"
								data-state={state}
								className={twMerge(
									'flex size-9 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm transition-colors',
									'[&_svg]:size-4',
									state === 'complete' && 'border-primary bg-primary text-primary-foreground',
									state === 'current' && 'border-primary bg-surface text-primary',
									state === 'upcoming' && 'border-border bg-muted text-muted-foreground',
								)}
							>
								{state === 'complete' ? <Check /> : (step.icon ?? index + 1)}
							</span>
							<span
								data-slot="stepper-label"
								data-state={state}
								className={twMerge(
									'whitespace-nowrap font-mono text-sm',
									state === 'upcoming' ? 'text-muted-foreground' : 'font-medium text-primary',
									state === 'complete' && 'text-foreground-subtle',
								)}
							>
								{step.label}
							</span>
						</div>

						{index < steps.length - 1 ? (
							<span
								data-slot="stepper-connector"
								aria-hidden
								className={twMerge('mx-3 h-0.5 flex-1 rounded-full', index < currentStep ? 'bg-primary' : 'bg-border')}
							/>
						) : null}
					</li>
				)
			})}
		</ol>
	)
}

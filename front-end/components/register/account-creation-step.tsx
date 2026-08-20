import { useState, type ReactNode } from 'react'
import { Search, Sparkles, ShieldCheck, User, Building2, ShieldCheck as ShieldCheckIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { TextField } from '../ui/text-field'
import { PasswordField } from '../ui/password-field'
import { Stepper } from '../ui/stepper'
import type { AccountCreationData } from '@/types/register'

export type { AccountCreationData }

export interface AccountCreationStepProps {
	defaultValues?: Partial<AccountCreationData>
	onBackToLogin?: () => void
	onNext: (data: AccountCreationData) => void
}

const benefits: { icon: ReactNode; title: string; description: string }[] = [
	{
		icon: <Search className="size-5" />,
		title: 'Unprecedented Transparency',
		description:
			'Gain immediate access to aggregated public procurement data across multiple sectors, ensuring a level playing field for SMEs.',
	},
	{
		icon: <Sparkles className="size-5" />,
		title: 'Actionable Intelligence',
		description:
			'Utilize high-density data visualizations and budgeting alerts to track procurement status and identify lucrative bidding opportunities.',
	},
	{
		icon: <ShieldCheck className="size-5" />,
		title: 'Systematic Oversight',
		description:
			'Our authoritative platform serves as a neutral lens for public data, fostering trust and accountability in government spending.',
	},
]

export function AccountCreationStep({ defaultValues, onBackToLogin, onNext }: AccountCreationStepProps) {
	const [fullName, setFullName] = useState(defaultValues?.fullName ?? '')
	const [email, setEmail] = useState(defaultValues?.email ?? '')
	const [password, setPassword] = useState(defaultValues?.password ?? '')

	function handleSubmit() {
		onNext({ fullName, email, password })
	}

	return (
		<div data-slot="account-creation-step" className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
			<div className="flex flex-col gap-10 px-6 py-10 sm:px-12 lg:px-16 lg:py-16">
				<span className="font-display text-2xl font-bold text-primary">MonitoraGov</span>

				<div className="flex w-full max-w-lg flex-col gap-8">
					<Stepper
						steps={[
							{ label: 'Account', icon: <User /> },
							{ label: 'Business Info', icon: <Building2 /> },
							{ label: 'Verification', icon: <ShieldCheckIcon /> },
						]}
						currentStep={0}
					/>

					<div className="flex flex-col gap-2">
						<h1 className="font-display text-3xl font-bold text-foreground">Account Creation</h1>
						<p className="text-sm text-foreground-subtle">
							Step 1: Set up your primary user credentials for institutional access.
						</p>
					</div>

					<div className="flex flex-col gap-5">
						<TextField
							label="Full Name"
							placeholder="e.g. Jane Doe"
							value={fullName}
							onChange={(event) => setFullName(event.target.value)}
							autoComplete="name"
						/>
						<TextField
							label="Institutional Email"
							type="email"
							placeholder="jane.doe@company.com"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							autoComplete="email"
						/>
						<PasswordField
							label="Password"
							placeholder="********"
							hint="Must be at least 8 characters, containing one number and one uppercase letter."
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							autoComplete="new-password"
						/>
					</div>

					<div className="flex items-center justify-between gap-3">
						<Button variant="outline-dark" onClick={onBackToLogin}>
							
						</Button>
						<Button variant="primary" onClick={handleSubmit}>
							Informações da empresa
						</Button>
					</div>
				</div>
			</div>

			<div className="hidden flex-col gap-10 border-l border-border bg-background-alt px-16 py-16 lg:flex">
				<h2 className="font-display text-2xl font-bold text-foreground">Why join MonitoraGov?</h2>

				<div className="flex flex-col gap-8">
					{benefits.map((benefit) => (
						<div key={benefit.title} className="flex gap-4">
							<span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								{benefit.icon}
							</span>
							<div className="flex flex-col gap-1">
								<h3 className="font-display text-base font-semibold text-foreground">{benefit.title}</h3>
								<p className="text-sm text-foreground-subtle">{benefit.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Briefcase, Building2, Mail, Tag, ShieldCheck } from 'lucide-react'
import { Button } from '../ui/button'
import { TextField } from '../ui/text-field'
import { SelectField, type SelectFieldOption } from '../ui/select-field'
import { Stepper } from '../ui/stepper'
import { Card, CardContent, CardFooter } from '../ui/card'
import type { BusinessCategory, BusinessInfoData } from '@/types/register'

export type { BusinessInfoData }

export interface BusinessInfoStepProps {
	defaultValues?: Partial<BusinessInfoData>
	onBack: () => void
	onNext: (data: BusinessInfoData) => void
}

const categories: SelectFieldOption[] = [
	{ label: 'Construction & Infrastructure', value: 'construction' },
	{ label: 'Information Technology', value: 'it' },
	{ label: 'Healthcare & Medical Supplies', value: 'healthcare' },
	{ label: 'Consulting Services', value: 'consulting' },
	{ label: 'Other', value: 'other' },
]

export function BusinessInfoStep({ defaultValues, onBack, onNext }: BusinessInfoStepProps) {
	const [cnpj, setCnpj] = useState<string>(defaultValues?.cnpj ?? '')
	const [legalName, setLegalName] = useState<string>(defaultValues?.legalName ?? '')
	const [contactEmail, setContactEmail] = useState<string>(defaultValues?.contactEmail ?? '')
	const [category, setCategory] = useState<BusinessCategory | ''>(defaultValues?.category ?? '')

	function handleCategoryChange(value: string): void {
		if (value === 'construction' || value === 'it' || value === 'healthcare' || value === 'consulting' || value === 'other') {
			setCategory(value)
			return
		}

		setCategory('')
	}

	function handleSubmit(): void {
		onNext({ cnpj, legalName, contactEmail, category })
	}

	return (
		<div data-slot="business-info-step" className="min-h-screen bg-background px-6 py-12 sm:px-10">
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
				<Stepper
					steps={[{ label: 'Account' }, { label: 'Business Info' }, { label: 'Verification' }]}
					currentStep={1}
					align="center"
				/>

				<div className="flex flex-col gap-2 text-center">
					<h1 className="font-display text-3xl font-bold text-foreground">Business Information</h1>
					<p className="text-sm text-foreground-subtle">
						Please provide your company&apos;s official registration details. This information must match federal
						records.
					</p>
				</div>

				<Card>
					<CardContent>
						<TextField
							label="CNPJ (National Registry)"
							placeholder="00.000.000/0000-00"
							required
							icon={<Briefcase />}
							hint="Format: 14 digits"
							value={cnpj}
							onChange={(event) => setCnpj(event.target.value)}
						/>

						<TextField
							label="Legal Company Name (Razão Social)"
							placeholder="E.g., Tech Solutions Ltda."
							required
							icon={<Building2 />}
							value={legalName}
							onChange={(event) => setLegalName(event.target.value)}
						/>

						<TextField
							label="Official Contact Email"
							type="email"
							placeholder="contact@company.com"
							required
							icon={<Mail />}
							value={contactEmail}
							onChange={(event) => setContactEmail(event.target.value)}
						/>

						<SelectField
							label="Primary Business Category"
							placeholder="Select a category..."
							required
							icon={<Tag />}
							options={categories}
							value={category}
							onValueChange={handleCategoryChange}
						/>

						<div className="flex gap-3 rounded-lg bg-background-alt p-4">
							<ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
							<div className="flex flex-col gap-1">
								<h4 className="font-display text-sm font-semibold text-foreground">Verificação de Dados</h4>
								<p className="text-sm text-foreground-subtle">
									Utilizamos o seu CNPJ para efetuar automaticamente uma verificação cruzada com bases de dados federais oficiais. Isto garante a confiança institucional e prepara o seu perfil para receber alertas seguros relativos ao acompanhamento de contratos públicos.
								</p>
							</div>
						</div>
					</CardContent>

					<CardFooter>
						<Button variant="outline-dark" onClick={onBack}>
							<ArrowLeft />
							Voltar
						</Button>
						<Button variant="primary" onClick={handleSubmit}>
							Adicionar documentos
							<ArrowRight />
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}

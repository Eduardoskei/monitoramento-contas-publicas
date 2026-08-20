import { BarChart3, CircleCheck, Bell } from 'lucide-react'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'

const FEATURES = [
	{
		icon: BarChart3,
		title: 'Monitoramento em Tempo Real',
		description: 'Acompanhamento das cotas de ME/EPP por departamento.',
	},
	{
		icon: CircleCheck,
		title: 'Validação Automática',
		description: 'Integração com o Open-CNPJ para checagens instantâneas de elegibilidade.',
	},
	{
		icon: Bell,
		title: 'Alertas de Conformidade',
		description: 'Notificações automáticas quando metas estão em risco.',
	},
]

export function FeaturesSection() {
	return (
		<section id="features" data-slot="features-section" className="bg-background py-24 text-foreground">
			<div className="mx-auto max-w-7xl px-6">
				<h2 className="text-center text-3xl font-semibold text-balance">
					Tudo o que você precisa para uma gestão transparente.
				</h2>

				<div className="mt-14 grid gap-5 md:grid-cols-3">
					{FEATURES.map((feature) => (
						<Card key={feature.title} className="bg-surface">
							<div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<feature.icon aria-hidden />
							</div>
							<CardTitle>{feature.title}</CardTitle>
							<CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}
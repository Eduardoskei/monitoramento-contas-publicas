import { ArrowRight } from 'lucide-react'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'

const SOLUTIONS = [
	{
		title: 'Governos Públicos',
		description: 'Controle absoluto e conformidade legal (LC 123/2006).',
	},
	{
		title: 'ME',
		description: 'Acesso facilitado a novas oportunidades de negócio.',
	},
]

export function SolutionsSection() {
	return (
		<section id="solutions" data-slot="solutions-section" className="flex justify-center bg-cream py-24 text-ink">
			<div className="mx-auto max-w-7xl px-6">
				<h2 className="text-center text-3xl font-semibold text-balance">Soluções para cada perfil.</h2>

				<div className="mt-14 grid gap-5 md:grid-cols-2">
					{SOLUTIONS.map((solution) => (
						<Card key={solution.title} className="border-border-light bg-cream-raised/60">
							<CardTitle className="text-primary">{solution.title}</CardTitle>
							<CardDescription className="text-ink-subtle">{solution.description}</CardDescription>
							<a
								href="#"
								className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
							>
								Saiba mais
								<ArrowRight className="size-3.5" />
							</a>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}
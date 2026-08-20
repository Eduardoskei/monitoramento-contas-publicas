import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const AVATAR_GROUP = [
	{ label: 'Gov', className: 'bg-foreground/10 text-foreground' },
	{ label: 'ME', className: 'bg-primary text-primary-foreground' },
	{ label: 'EPP', className: 'bg-fuchsia-400 text-fuchsia-950' },
]

export function HeroSection() {
	return (
		<section data-slot="hero-section" className="relative overflow-hidden bg-background text-foreground">
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						'radial-gradient(60% 50% at 20% 0%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent)',
				}}
			/>

			<div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center">
				<div>
					<Badge variant="dark">
						<span className="size-1.5 rounded-full bg-accent" />
						Nova plataforma
					</Badge>

					<h1 className="mt-6 text-5xl font-bold leading-[1.08] tracking-tight text-balance">
						Transforme Compras Públicas em{' '}
						<span className="text-accent">Oportunidades Reais.</span>
					</h1>

					<p className="mt-6 max-w-md text-base leading-relaxed text-foreground-subtle">
						A plataforma inteligente para municípios e pequenas empresas monitorarem, analisarem e
						ampliarem a participação de ME/EPP em licitações públicas com total transparência.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						<Button variant="primary" size="lg">
							Solicitar Demonstração
							<ArrowRight />
						</Button>
						<Button variant="outline-dark" size="lg">
							Conhecer a Plataforma
						</Button>
					</div>

					<div className="mt-14 flex items-center gap-4 border-t border-white/10 pt-6">
						<div className="flex -space-x-2">
							{AVATAR_GROUP.map((avatar) => (
								<div
									key={avatar.label}
									className={`flex size-8 items-center justify-center rounded-full border-2 border-background text-[10px] font-semibold ${avatar.className}`}
								>
									{avatar.label}
								</div>
							))}
						</div>
						<p className="text-sm text-muted-foreground">
							Conectando o setor público aos pequenos negócios.
						</p>
					</div>
				</div>

				<DashboardMockup />
			</div>
		</section>
	)
}

function DashboardMockup() {
	return (
		<div
			data-slot="dashboard-mockup"
			className="relative overflow-hidden rounded-xl border border-white/10 bg-foreground/5 shadow-2xl shadow-black/50"
		>
			<div className="flex items-center gap-2 border-b border-white/10 bg-black/30 px-4 py-2.5">
				<div className="flex gap-1.5">
					<span className="size-2.5 rounded-full bg-red-500/80" />
					<span className="size-2.5 rounded-full bg-yellow-500/80" />
					<span className="size-2.5 rounded-full bg-green-500/80" />
				</div>
				<span className="mx-auto font-mono text-xs text-muted-foreground">app.monitoragov.br</span>
			</div>

			<div className="relative h-80 bg-linear-to-br from-foreground/10 to-foreground/2">
				<div className="absolute bottom-6 left-6 w-56 rounded-lg border border-border bg-surface p-4 shadow-xl">
					<p className="text-xs text-muted-foreground">Participação ME/EPP</p>
					<p className="mt-1 text-4xl font-bold text-accent">42%</p>
					<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
						Neste trimestre. Meta dentro do esperado.
					</p>
				</div>
			</div>
		</div>
	)
}
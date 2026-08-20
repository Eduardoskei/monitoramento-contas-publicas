import { Button } from '@/components/ui/button'

export function CtaSection() {
	return (
		<section data-slot="cta-section" className="bg-cream px-6 py-24">
			<div className="mx-auto max-w-4xl rounded-3xl border border-border bg-background px-8 py-16 text-center text-foreground">
				<h2 className="text-3xl font-semibold text-balance">
					Pronto para transformar sua gestão municipal?
				</h2>
				<p className="mt-3 text-foreground-subtle">Presente em todo o estado do Ceará</p>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Button variant="primary" size="lg">
						Solicitar Demonstração
					</Button>
					<Button variant="outline-dark" size="lg">
						Ver Planos
					</Button>
				</div>
			</div>
		</section>
	)
}
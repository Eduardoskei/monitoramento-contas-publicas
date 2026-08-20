import { Download, FileText } from 'lucide-react'
import { Button } from '../ui/button'

export function Topbar() {
	return (
		<header
			data-slot="topbar"
			className="flex h-16 shrink-0 items-center justify-between gap-6 border-b border-border bg-surface px-6"
		>
			<div className="flex items-center gap-8">
				<span className="font-display text-lg font-bold text-primary">Gestão SEBRAE</span>
			</div>

			<div className="flex items-center gap-3">

				<Button variant="outline-dark" size="sm">
					<Download className="size-3.5" />
					Exportar Dados
				</Button>

				<Button variant="primary" size="sm">
					<FileText className="size-3.5" />
					Gerar Relatório
				</Button>

				<span
					data-slot="avatar"
					className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft font-mono text-xs font-medium text-primary-hover"
				>
					AD
				</span>
			</div>
		</header>
	)
}
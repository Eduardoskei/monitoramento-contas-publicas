import { AlertTriangle, CheckCircle2, LogIn } from 'lucide-react'
import type { ReactNode } from 'react'

interface SecurityLog {
	icon: ReactNode
	title: string
	detail: string
}

const logs: SecurityLog[] = [
	{
		icon: <AlertTriangle className="size-4 text-destructive" />,
		title: 'Tentativa de login falhou',
		detail: 'IP: 192.168.1.45 · 10:42',
	},
	{
		icon: <CheckCircle2 className="size-4 text-primary-hover" />,
		title: 'Configurações do admin atualizadas',
		detail: 'Por: Carlos Mendes · 09:15',
	},
	{
		icon: <LogIn className="size-4 text-foreground-subtle" />,
		title: 'Novo dispositivo autorizado',
		detail: 'Por: Ana Silva · ontem',
	},
]

export function SecurityLogsCard() {
	return (
		<div data-slot="security-logs-card" className="rounded-xl border border-border bg-surface p-5">
			<div className="flex items-center justify-between">
				<h2 className="font-display text-lg font-bold text-foreground">Logs de Segurança</h2>
				<a href="/admin/security-logs" className="font-mono text-xs text-primary hover:underline">
					Ver Tudo
				</a>
			</div>

			<ul className="mt-4 flex flex-col gap-4">
				{logs.map((log) => (
					<li key={log.title} className="flex items-start gap-3">
						<span className="mt-0.5 shrink-0">{log.icon}</span>
						<div className="flex flex-col gap-0.5">
							<span className="text-sm text-foreground">{log.title}</span>
							<span className="font-mono text-xs text-muted-foreground">{log.detail}</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
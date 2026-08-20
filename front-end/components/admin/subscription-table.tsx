import { ChevronLeft, ChevronRight, Download, Circle, AlertTriangle, Clock } from 'lucide-react'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'

interface Subscription {
	initials: string
	municipality: string
	id: string
	planTier: string
	status: 'ativo' | 'expirado' | 'pendente'
	startDate: string
	renewalDate: string
}

const subscriptions: Subscription[] = [
	{
		initials: 'SP',
		municipality: 'São Paulo',
		id: 'MUN-001',
		planTier: 'Enterprise',
		status: 'ativo',
		startDate: '01 jan. 2024',
		renewalDate: '31 dez. 2024',
	},
	{
		initials: 'RJ',
		municipality: 'Rio de Janeiro',
		id: 'MUN-042',
		planTier: 'Pro Tier',
		status: 'expirado',
		startDate: '15 mar. 2023',
		renewalDate: '14 mar. 2024',
	},
	{
		initials: 'MG',
		municipality: 'Belo Horizonte',
		id: 'MUN-018',
		planTier: 'Basic Tier',
		status: 'pendente',
		startDate: '-',
		renewalDate: '-',
	},
	{
		initials: 'PR',
		municipality: 'Curitiba',
		id: 'MUN-088',
		planTier: 'Pro Tier',
		status: 'ativo',
		startDate: '01 jun. 2023',
		renewalDate: '31 mai. 2024',
	},
]

const statusConfig = {
	ativo: { label: 'ATIVO', variant: 'light', icon: <Circle className="size-2 fill-current" /> },
	expirado: { label: 'EXPIRADO', variant: 'dark', icon: <AlertTriangle className="size-3" /> },
	pendente: { label: 'PENDENTE', variant: 'light', icon: <Clock className="size-3" /> },
} as const

export function SubscriptionsTable() {
	return (
		<div data-slot="subscriptions-table-card" className="rounded-xl border border-border bg-surface">
			<div className="flex items-center gap-3 border-b border-border p-5">
				<Input
					type="search"
					placeholder="Buscar por nome do município ou ID..."
					className="text-sm"
				/>

				<select
					className="h-11 rounded-md border border-input bg-surface px-3 font-mono text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
					defaultValue="all-plans"
				>
					<option value="all-plans">Todos os Planos</option>
					<option value="enterprise">Enterprise</option>
					<option value="pro">Pro Tier</option>
					<option value="basic">Basic Tier</option>
				</select>

				<select
					className="h-11 rounded-md border border-input bg-surface px-3 font-mono text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
					defaultValue="all-statuses"
				>
					<option value="all-statuses">Todos os Status</option>
					<option value="ativo">Ativo</option>
					<option value="expirado">Expirado</option>
					<option value="pendente">Pendente</option>
				</select>

				<button
					type="button"
					aria-label="Baixar dados"
					className="flex size-11 shrink-0 items-center justify-center rounded-md border border-input text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground"
				>
					<Download className="size-4" />
				</button>
			</div>

			<table data-slot="subscriptions-table" className="w-full border-collapse">
				<thead>
					<tr className="border-b border-border bg-background-alt">
						<th className="px-5 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
							Município
						</th>
						<th className="px-5 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
							Plano
						</th>
						<th className="px-5 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
							Status
						</th>
						<th className="px-5 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
							Data de Início
						</th>
						<th className="px-5 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
							Data de Renovação
						</th>
						<th className="px-5 py-3 text-right font-mono text-xs font-medium text-muted-foreground">
							Ações
						</th>
					</tr>
				</thead>
				<tbody>
					{subscriptions.map((subscription) => {
						const status = statusConfig[subscription.status]

						return (
							<tr key={subscription.id} className="border-b border-border last:border-b-0">
								<td className="px-5 py-4">
									<div className="flex items-center gap-3">
										<span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs font-medium text-foreground-subtle">
											{subscription.initials}
										</span>
										<div className="flex flex-col">
											<span className="text-sm font-medium text-foreground">
												{subscription.municipality}
											</span>
											<span className="font-mono text-xs text-muted-foreground">
												ID: {subscription.id}
											</span>
										</div>
									</div>
								</td>
								<td className="px-5 py-4 text-sm text-foreground-subtle">{subscription.planTier}</td>
								<td className="px-5 py-4">
									<Badge variant={status.variant}>
										<span className="flex items-center gap-1.5">
											{status.icon}
											{status.label}
										</span>
									</Badge>
								</td>
								<td className="px-5 py-4 text-sm text-foreground-subtle">{subscription.startDate}</td>
								<td
									className={
										subscription.status === 'expirado'
											? 'px-5 py-4 text-sm font-medium text-destructive'
											: 'px-5 py-4 text-sm text-foreground-subtle'
									}
								>
									{subscription.renewalDate}
								</td>
								<td className="px-5 py-4 text-right">
									<button
										type="button"
										className="font-mono text-xs text-primary hover:underline"
									>
										Ver detalhes
									</button>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>

			<div className="flex items-center justify-between px-5 py-4">
				<span className="font-mono text-xs text-muted-foreground">
					Mostrando 1 a 4 de 128 municípios
				</span>

				<nav aria-label="Paginação" className="flex items-center gap-1.5">
					<button
						type="button"
						aria-label="Página anterior"
						className="flex size-8 items-center justify-center rounded-md border border-border text-foreground-subtle transition-colors hover:bg-muted"
					>
						<ChevronLeft className="size-4" />
					</button>
					<button
						type="button"
						aria-current="page"
						className="flex size-8 items-center justify-center rounded-md bg-primary font-mono text-sm font-medium text-primary-foreground"
					>
						1
					</button>
					<button
						type="button"
						className="flex size-8 items-center justify-center rounded-md font-mono text-sm text-foreground-subtle transition-colors hover:bg-muted"
					>
						2
					</button>
					<button
						type="button"
						className="flex size-8 items-center justify-center rounded-md font-mono text-sm text-foreground-subtle transition-colors hover:bg-muted"
					>
						3
					</button>
					<span className="px-1 font-mono text-sm text-muted-foreground">...</span>
					<button
						type="button"
						aria-label="Próxima página"
						className="flex size-8 items-center justify-center rounded-md border border-border text-foreground-subtle transition-colors hover:bg-muted"
					>
						<ChevronRight className="size-4" />
					</button>
				</nav>
			</div>
		</div>
	)
}
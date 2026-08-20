import { Circle, AlertTriangle } from 'lucide-react'
import { Badge } from '../../ui/badge'

interface SubscriptionOverview {
	planTier: string
	municipality: string
	status: 'ativo' | 'expirado'
	renewalDate: string
}

const subscriptions: SubscriptionOverview[] = [
	{ planTier: 'PRO TIER', municipality: 'São Paulo', status: 'ativo', renewalDate: '31 dez. 2024' },
	{ planTier: 'ENTERPRISE', municipality: 'Rio de Janeiro', status: 'ativo', renewalDate: '15 jan. 2025' },
	{ planTier: 'BASIC TIER', municipality: 'Salvador', status: 'expirado', renewalDate: '01 out. 2023' },
]

export function SubscriptionOverviewCards() {
	return (
		<div data-slot="subscription-overview" className="flex flex-col gap-4">
			<h2 className="font-display text-2xl font-bold text-foreground">Visão Geral de Assinaturas</h2>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{subscriptions.map((subscription) => (
					<div
						key={subscription.municipality}
						data-slot="subscription-overview-card"
						className="rounded-xl border border-border bg-surface p-5"
					>
						<div className="flex items-center justify-between">
							<span className="font-mono text-xs font-medium tracking-wide text-muted-foreground uppercase">
								{subscription.planTier}
							</span>
							{subscription.status === 'ativo' ? (
								<Badge variant="dark">
									<Circle className="size-2 fill-current" />
									ATIVO
								</Badge>
							) : (
								<Badge variant="light">
									<AlertTriangle className="size-3" />
									EXPIRADO
								</Badge>
							)}
						</div>

						<p className="font-display mt-2 text-2xl font-bold text-foreground">
							{subscription.municipality}
						</p>

						<div className="mt-4 flex items-center justify-between border-t border-border pt-3">
							<span className="font-mono text-xs text-muted-foreground">Renovação:</span>
							<span
								className={
									subscription.status === 'expirado'
										? 'font-mono text-sm font-medium text-destructive'
										: 'font-mono text-sm text-foreground-subtle'
								}
							>
								{subscription.renewalDate}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
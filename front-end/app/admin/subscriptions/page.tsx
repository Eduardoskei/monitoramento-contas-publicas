import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubscriptionsTable } from '@/components/admin/subscription-table'

export default function SubscriptionsPage() {
	return (
		<div data-slot="subscriptions-page" className="flex flex-col gap-8">
			<div className="flex items-start justify-between">
				<div className="flex flex-col gap-1.5">
					<h1 className="font-display text-3xl font-bold text-foreground">
						Assinaturas Municipais
					</h1>
					<p className="text-foreground-subtle">
						Gerencie e monitore as assinaturas ativas da plataforma nos municípios.
					</p>
				</div>

				<Button variant="primary" size="sm">
					<Plus className="size-4" />
					Nova Assinatura
				</Button>
			</div>

			<SubscriptionsTable />
		</div>
	)
}
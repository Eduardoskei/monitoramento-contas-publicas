import { StatCard } from '@/components/admin/overview/stat-card'
import { ProcurementVolumeChart } from '@/components/admin/overview/procurement-volume-chart'
import ProcurementTrendChart from '@/components/admin/overview/procurement-trend-chart'

export default function ExecutiveOverviewPage() {
	return (
		<div data-slot="executive-overview-page" className="flex flex-col gap-8">
			<div className="flex flex-col gap-1.5">
				<h1 className="font-display text-3xl font-bold text-foreground">Visão Geral da Plataforma</h1>
				<p className="text-foreground-subtle">
					Principais métricas e tendências de compras públicas do ano fiscal atual.
				</p>
			</div>

			<div className="grid grid-cols-3 gap-5">
				<StatCard
					label="Percentual de Compras ME/EPP"
					value="34,2%"
					trend={{ direction: 'up', text: '+2,4% em relação ao trimestre anterior' }}
				/>
				<StatCard
					label="Volume Total de Licitações"
					value="R$ 41,5M"
					trend={{ direction: 'neutral', text: 'Estável entre os departamentos' }}
				/>
				<StatCard
					label="Contratos Ativos"
					value="1.248"
					trend={{ direction: 'neutral', text: '32 com renovação pendente este mês' }}
				/>
			</div>

			<ProcurementVolumeChart />
			<ProcurementTrendChart />
		</div>
	)
}
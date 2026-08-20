'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Download } from 'lucide-react'
import { Button } from '../../ui/button'

const data = [
	{ month: 'Jan', total: 3.2, sme: 0.8 },
	{ month: 'Fev', total: 3.5, sme: 0.85 },
	{ month: 'Mar', total: 3.1, sme: 0.87 },
	{ month: 'Abr', total: 3.95, sme: 1.15 },
	{ month: 'Mai', total: 3.75, sme: 1.05 },
	{ month: 'Jun', total: 4.15, sme: 1.35 },
	{ month: 'Jul', total: 3.85, sme: 1.25 },
	{ month: 'Ago', total: 4.45, sme: 1.6 },
	{ month: 'Set', total: 4.05, sme: 1.5 },
	{ month: 'Out', total: 4.75, sme: 1.75 },
	{ month: 'Nov', total: 4.55, sme: 1.65 },
	{ month: 'Dez', total: 5.15, sme: 1.95 },
]

export function ProcurementVolumeChart() {
	return (
		<div data-slot="procurement-volume-chart" className="rounded-xl border border-border bg-surface p-6">
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-1.5">
					<h2 className="font-display text-xl font-bold text-foreground">
						Comparativo de Volume de Compras
					</h2>
					<p className="text-sm text-foreground-subtle">
						Análise do gasto municipal total versus alocação para Micro Empresas.
					</p>
				</div>

				<Button variant="primary" size="sm">
					<Download className="size-3.5" />
					Exportar Dados
				</Button>
			</div>

			<div className="mt-4 flex items-center gap-5">
				<span className="flex items-center gap-1.5 font-mono text-xs text-foreground-subtle">
					<span className="size-2.5 rounded-full bg-foreground" />
					Total de Licitações
				</span>
				<span className="flex items-center gap-1.5 font-mono text-xs text-foreground-subtle">
					<span className="size-2.5 rounded-full bg-primary" />
					Licitações ME
				</span>
			</div>

			<div className="mt-4 h-80 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={data} barGap={4}>
						<CartesianGrid vertical={false} stroke="var(--color-border)" />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={(tickValue: number) => `R$ ${tickValue}M`}
							tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
						/>
						<Tooltip
							formatter={(tickValue) => `R$ ${Number(tickValue ?? 0)}M`}
							contentStyle={{
								borderRadius: 8,
								border: '1px solid var(--color-border)',
								fontSize: 12,
								fontFamily: 'var(--font-mono)',
							}}
						/>
						<Bar dataKey="total" fill="var(--color-foreground)" radius={[3, 3, 0, 0]} />
						<Bar dataKey="sme" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
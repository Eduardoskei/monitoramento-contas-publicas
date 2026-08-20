'use client'

import { useMemo, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'

interface DirectoryUser {
	name: string
	municipality: string
	role: 'ME' | 'Prefeitura'
	lastAccess: string
}

const users: DirectoryUser[] = [
	{ name: 'Ana Silva', municipality: 'São Paulo, SP', role: 'ME', lastAccess: 'há 2 min' },
	{ name: 'Carlos Mendes', municipality: 'Campinas, SP', role: 'Prefeitura', lastAccess: 'há 1 hora' },
	{ name: 'Beatriz Costa', municipality: 'Belo Horizonte, MG', role: 'ME', lastAccess: 'ontem' },
	{ name: 'João Paulo', municipality: 'Curitiba, PR', role: 'ME', lastAccess: '24 out. 2023' },
]

const roleFilters = ['Todas', 'ME', 'Prefeitura'] as const

export function UserDirectoryTable() {
	const [query, setQuery] = useState('')
	const [roleFilter, setRoleFilter] = useState<(typeof roleFilters)[number]>('Todas')

	const filteredUsers = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase()

		return users.filter((user) => {
			const matchesRole = roleFilter === 'Todas' || user.role === roleFilter
			const matchesQuery =
				normalizedQuery.length === 0 ||
				user.name.toLowerCase().includes(normalizedQuery) ||
				user.municipality.toLowerCase().includes(normalizedQuery)

			return matchesRole && matchesQuery
		})
	}, [query, roleFilter])

	return (
		<div data-slot="user-directory-card" className="rounded-xl border border-border bg-surface">
			<div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="font-display text-2xl font-bold text-foreground">Diretório de Usuários</h2>

				<Input
					type="search"
					placeholder="Buscar usuários..."
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					className="text-sm"
				/>
			</div>

			<div className="flex items-center gap-2 border-b border-border px-5 py-3">
				{roleFilters.map((filter) => (
					<button
						key={filter}
						type="button"
						onClick={() => setRoleFilter(filter)}
						data-active={roleFilter === filter ? '' : undefined}
						className="rounded-full border border-border px-3 py-1 font-mono text-xs text-foreground-subtle transition-colors hover:bg-muted data-active:border-primary data-active:bg-primary-soft data-active:font-medium data-active:text-primary-hover"
					>
						{filter === 'Todas' ? 'Todas as Funções' : filter}
					</button>
				))}
			</div>

			<table data-slot="user-directory-table" className="w-full border-collapse">
				<thead>
					<tr className="border-b border-border bg-background-alt">
						<th className="px-5 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
							Nome
						</th>
						<th className="px-5 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
							Município
						</th>
						<th className="px-5 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
							Função
						</th>
						<th className="px-5 py-3 text-left font-mono text-xs font-medium text-muted-foreground">
							Último Acesso
						</th>
						<th className="px-5 py-3 text-right font-mono text-xs font-medium text-muted-foreground">
							Ações
						</th>
					</tr>
				</thead>
				<tbody>
					{filteredUsers.length === 0 ? (
						<tr>
							<td colSpan={5} className="px-5 py-10 text-center">
								<p className="text-sm text-foreground-subtle">
									Nenhum usuário encontrado para os filtros aplicados.
								</p>
							</td>
						</tr>
					) : (
						filteredUsers.map((user) => (
							<tr key={user.name} className="border-b border-border last:border-b-0">
								<td className="px-5 py-4 text-sm font-medium text-foreground">{user.name}</td>
								<td className="px-5 py-4 text-sm text-foreground-subtle">{user.municipality}</td>
								<td className="px-5 py-4">
									<Badge variant={user.role === 'ME' ? 'dark' : 'light'}>{user.role}</Badge>
								</td>
								<td className="px-5 py-4 text-sm text-foreground-subtle">{user.lastAccess}</td>
								<td className="px-5 py-4 text-right">
									<button
										type="button"
										aria-label={`Mais ações para ${user.name}`}
										className="inline-flex size-8 items-center justify-center rounded-md text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground"
									>
										<MoreVertical className="size-4" />
									</button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>

			<div className="border-t border-border px-5 py-3">
				<span className="font-mono text-xs text-muted-foreground">
					Mostrando {filteredUsers.length} de {users.length} usuários
				</span>
			</div>
		</div>
	)
}
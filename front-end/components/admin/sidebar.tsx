'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	LayoutGrid,
	Briefcase,
	Users,
	Activity,
	Shield,
	Settings,
	HelpCircle,
	Plus,
	Building2,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../ui/button'

const mainNavItems = [
	{ href: '/admin/overview', label: 'Visão Geral', icon: LayoutGrid },
	{ href: '/admin/subscriptions', label: 'Assinaturas', icon: Briefcase },
	{ href: '/admin/users', label: 'Diretório de Usuários', icon: Users },
	{ href: '/admin/monitoring', label: 'Monitoramento de Dados', icon: Activity },
	{ href: '/admin/security-logs', label: 'Logs de Segurança', icon: Shield },
] as const

const footerNavItems = [
	{ href: '/admin/settings', label: 'Configurações', icon: Settings },
	{ href: '/admin/support', label: 'Suporte', icon: HelpCircle },
] as const

export function Sidebar() {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(true)

	return (
		<aside
			data-slot="sidebar"
			data-open={isOpen ? '' : undefined}
			className={twMerge(
				'flex h-screen shrink-0 flex-col justify-between border-r border-border bg-background-alt py-6 transition-[width] duration-200 ease-in-out',
				isOpen ? 'w-64 px-4' : 'w-20 px-2',
			)}
		>
			<div className="flex flex-col gap-6">
				<div
					data-slot="sidebar-brand"
					className={twMerge(
						'flex items-center gap-2.5 px-1',
						!isOpen && 'flex-col justify-center gap-3 px-0',
					)}
				>
					<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
						<Building2 className="size-5" />
					</span>

					{isOpen ? (
						<div className="flex min-w-0 flex-1 flex-col leading-tight">
							<span className="font-display text-base font-bold text-primary">SEBRAE Admin</span>
							<span className="font-mono text-xs text-muted-foreground">Gestão da Plataforma</span>
						</div>
					) : null}

					<button
						type="button"
						onClick={() => setIsOpen((prev) => !prev)}
						aria-label={isOpen ? 'Recolher menu' : 'Expandir menu'}
						data-slot="sidebar-toggle"
						className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground"
					>
						{isOpen ? <ChevronLeft className="size-3.5" /> : <ChevronRight className="size-3.5" />}
					</button>
				</div>

				<Button
					variant="primary"
					size="sm"
					title={!isOpen ? 'Novo Relatório' : undefined}
					className={twMerge('w-full', !isOpen && 'px-0')}
				>
					<Plus className="size-4" />
					{isOpen ? 'Novo Relatório' : null}
				</Button>

				<nav data-slot="sidebar-nav" className="flex flex-col gap-1">
					{mainNavItems.map((item) => {
						const isActive = pathname?.startsWith(item.href)
						const Icon = item.icon

						return (
							<Link
								key={item.href}
								href={item.href}
								title={!isOpen ? item.label : undefined}
								data-slot="sidebar-nav-item"
								data-active={isActive ? '' : undefined}
								className={twMerge(
									'flex items-center gap-2.5 rounded-md px-3 py-2 font-mono text-sm text-foreground-subtle transition-colors',
									'hover:bg-muted hover:text-foreground',
									'data-active:bg-primary data-active:font-medium data-active:text-primary-foreground data-active:hover:bg-primary',
									!isOpen && 'justify-center px-0',
								)}
							>
								<Icon className="size-4 shrink-0" />
								{isOpen ? item.label : null}
							</Link>
						)
					})}
				</nav>
			</div>

			<nav data-slot="sidebar-footer-nav" className="flex flex-col gap-1 border-t border-border pt-4">
				{footerNavItems.map((item) => {
					const isActive = pathname?.startsWith(item.href)
					const Icon = item.icon

					return (
						<Link
							key={item.href}
							href={item.href}
							title={!isOpen ? item.label : undefined}
							data-slot="sidebar-nav-item"
							data-active={isActive ? '' : undefined}
							className={twMerge(
								'flex items-center gap-2.5 rounded-md px-3 py-2 font-mono text-sm text-foreground-subtle transition-colors',
								'hover:bg-muted hover:text-foreground',
								'data-active:bg-primary data-activwe:font-medium data-active:text-primary-foreground data-active:hover:bg-primary',
								!isOpen && 'justify-center px-0',
							)}
						>
							<Icon className="size-4 shrink-0" />
							{isOpen ? item.label : null}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
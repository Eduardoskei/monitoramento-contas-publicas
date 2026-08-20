import { Button } from '@/components/ui/button'
import Link from 'next/link'

const NAV_LINKS = [
	{ label: 'Funcionalidades', href: '#features' },
	{ label: 'Soluções', href: '#solutions' },
	{ label: 'Preços', href: '#pricing' },
]

export function SiteHeader() {
	return (
		<header data-slot="site-header" className="sticky top-0 z-50 bg-cream/10 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
				<Link href="/" className="text-lg font-bold text-primary">
					MonitoraME
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
					{NAV_LINKS.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="text-sm text-ink-subtle transition-colors hover:text-ink"
						>
							{link.label}
						</a>
					))}
				</nav>
				<div className="grid grid-cols-2 gap-4">
					<Link href={'/register'}>
						<Button variant="outline" size="sm" className="rounded-md">
							Cadastro
						</Button>
					</Link>
					<Link href={'/login'}>
						<Button variant="primary" size="sm" className="rounded-md">
							Login
						</Button>
					</Link>
				</div>
			</div>
		</header>
	)
}
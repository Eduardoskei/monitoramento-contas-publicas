import { Button } from '@/components/ui/button'
import Link from 'next/link'

const NAV_LINKS = [
	{ label: 'Funcionalidades', href: '#features' },
	{ label: 'Soluções', href: '#solutions' },
	{ label: 'Preços', href: '#pricing' },
]

export function SiteHeader() {
	return (
		<header data-slot="site-header" className="sticky top-0 z-50 border-b border-border-light bg-cream/10 backdrop-blur">
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

				<Button variant="primary" size="sm" className="rounded-md">
					Login
				</Button>
			</div>
		</header>
	)
}
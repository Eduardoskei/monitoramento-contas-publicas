const FOOTER_LINKS = [
	{ label: 'Institutional', href: '#' },
	{ label: 'Legal', href: '#' },
	{ label: 'Privacy Policy', href: '#' },
	{ label: 'Contact', href: '#' },
]

export function SiteFooter() {
	return (
		<footer data-slot="site-footer" className="border-t border-border-light bg-cream py-16 text-ink">
			<div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-6 md:flex-row">
				<div>
					<p className="text-lg font-bold text-primary">MonitoraGov</p>
					<p className="mt-2 max-w-xs text-sm text-ink-subtle">
						© 2024 MonitoraGov. Transparência em compras públicas para pequenas empresas.
					</p>
				</div>

				<div>
					<p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Links</p>
					<ul className="mt-3 flex flex-col gap-2">
						{FOOTER_LINKS.map((link) => (
							<li key={link.label}>
								<a href={link.href} className="text-sm text-ink-subtle hover:text-ink">
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	)
}
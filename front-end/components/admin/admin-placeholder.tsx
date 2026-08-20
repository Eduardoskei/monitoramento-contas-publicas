interface AdminPagePlaceholderProps {
	title: string
	description: string
}

export function AdminPagePlaceholder({ title, description }: AdminPagePlaceholderProps) {
	return (
		<div data-slot="admin-page-placeholder" className="flex flex-col gap-8">
			<div className="flex flex-col gap-1.5">
				<h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
				<p className="text-foreground-subtle">{description}</p>
			</div>

			<div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-surface">
				<p className="font-mono text-sm text-muted-foreground">Tela em construção</p>
			</div>
		</div>
	)
}
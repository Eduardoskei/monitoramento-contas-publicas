import { Scale } from 'lucide-react'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export function LoginForm() {
	return (
		<div
			data-slot="login-screen"
			className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-12"
		>
			<header data-slot="login-header" className="flex flex-col items-center gap-2 text-center">
				<div className="flex items-center gap-2">
					<Scale className="size-8 text-primary" strokeWidth={2.5} />
					<h1 className="font-display text-3xl font-bold text-primary">MonitoraGov</h1>
				</div>
				<p className="text-foreground-subtle">Portal de Monitoramento de Compras Públicas do MEs</p>
			</header>

			<Card className='min-w-lg min-h-48'>
				<form data-slot="login-form" className="flex flex-col gap-5">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="email" className="font-mono text-sm text-foreground-subtle">
							Email Institucional
						</label>
						<Input
							id="email"
							type="email"
							name="email"
							placeholder="user@gov.domain"
							autoComplete="username"
							required
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label htmlFor="password" className="font-mono text-sm text-foreground-subtle">
							Senha
						</label>
						<Input
							id="password"
							type="password"
							name="password"
							placeholder="••••••••"
							autoComplete="current-password"
							required
						/>
					</div>

					<Button type="submit">Login</Button>
				</form>
			</Card>

			<p className="font-sans text-sm text-foreground-subtle">
				Novo no MonitoraGov?{' '}
				<a href="/request-account" className="font-mono text-primary hover:underline">
					Request an account
				</a>
			</p>

			<footer className="font-mono text-xs text-muted-foreground">
				Secure Portal Access &bull; Restricted to Authorized Personnel
			</footer>
		</div>
	)
}
import type { Metadata } from 'next'
import { LoginForm } from '@/components/login/login-form'

export const metadata: Metadata = {
	title: 'Login · MonitoraGov',
	description: 'Public Procurement Transparency Portal',
}

export default function LoginPage() {
	return <LoginForm />
}
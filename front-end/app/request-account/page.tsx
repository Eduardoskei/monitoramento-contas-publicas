'use client'

import { useRouter } from 'next/navigation'
import { RegistrationWizard, type RegistrationData } from '@/components/register/registration-wizard'

export default function RegisterPage() {
	const router = useRouter()

	function handleComplete(data: RegistrationData) {
		console.log('Registration complete', data)
		router.push('/dashboard')
	}

	return (
		<RegistrationWizard
			onBackToHome={() => router.push('/')}
			onComplete={handleComplete}
		/>
	)
}

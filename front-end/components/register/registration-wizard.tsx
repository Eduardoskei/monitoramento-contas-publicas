import { useState } from 'react'
import { AccountCreationStep } from './account-creation-step'
import { BusinessInfoStep } from './business-info-step'
import { DocumentVerificationStep } from './document-verification-step'
import type {
	AccountCreationData,
	BusinessInfoData,
	RegistrationData,
	RegistrationStepIndex,
} from '@/types/register'

export type { RegistrationData }

export interface RegistrationWizardProps {
	onBackToHome?: () => void
	onComplete: (data: RegistrationData) => void
}

const emptyAccount: AccountCreationData = { fullName: '', email: '', password: '' }
const emptyBusiness: BusinessInfoData = { cnpj: '', legalName: '', contactEmail: '', category: '' }

export function RegistrationWizard({ onBackToHome, onComplete }: RegistrationWizardProps) {
	const [step, setStep] = useState<RegistrationStepIndex>(0)
	const [account, setAccount] = useState<AccountCreationData>(emptyAccount)
	const [business, setBusiness] = useState<BusinessInfoData>(emptyBusiness)

	if (step === 0) {
		return (
			<AccountCreationStep
				defaultValues={account}
				onBackToLogin={onBackToHome}
				onNext={(data: AccountCreationData) => {
					setAccount(data)
					setStep(1)
				}}
			/>
		)
	}

	if (step === 1) {
		return (
			<BusinessInfoStep
				defaultValues={business}
				onBack={() => setStep(0)}
				onNext={(data: BusinessInfoData) => {
					setBusiness(data)
					setStep(2)
				}}
			/>
		)
	}

	return (
		<DocumentVerificationStep
			onBack={() => setStep(1)}
			onComplete={(documents) => onComplete({ account, business, documents })}
		/>
	)
}

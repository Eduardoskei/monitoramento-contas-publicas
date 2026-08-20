export const BUSINESS_CATEGORIES = [
	'construction',
	'it',
	'healthcare',
	'consulting',
	'other',
] as const

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number]

export interface AccountCreationData {
	fullName: string
	email: string
	password: string
}

export interface BusinessInfoData {
	cnpj: string
	legalName: string
	contactEmail: string
	category: BusinessCategory | ''
}

export interface DocumentVerificationData {
	smeCertification: File | null
	proofOfCnpj: File | null
	legalRepresentativeId: File | null
}

export interface RegistrationData {
	account: AccountCreationData
	business: BusinessInfoData
	documents: DocumentVerificationData
}

/** Índice (0-based) de cada etapa do wizard, para evitar "magic numbers". */
export const REGISTRATION_STEPS = ['account', 'business', 'documents'] as const
export type RegistrationStepKey = (typeof REGISTRATION_STEPS)[number]
export type RegistrationStepIndex = 0 | 1 | 2

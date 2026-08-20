import { useState } from 'react'
import { ArrowLeft, ShieldCheck, FileText, IdCard, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Stepper } from '../ui/stepper'
import { FileUploadField } from '../ui/file-upload-field'
import type { DocumentVerificationData } from '@/types/register'

export type { DocumentVerificationData }

export interface DocumentVerificationStepProps {
	onBack: () => void
	onComplete: (data: DocumentVerificationData) => void
}

export function DocumentVerificationStep({ onBack, onComplete }: DocumentVerificationStepProps) {
	const [smeCertification, setSmeCertification] = useState<File | null>(null)
	const [proofOfCnpj, setProofOfCnpj] = useState<File | null>(null)
	const [legalRepresentativeId, setLegalRepresentativeId] = useState<File | null>(null)

	function handleSubmit(): void {
		onComplete({ smeCertification, proofOfCnpj, legalRepresentativeId })
	}

	return (
		<div data-slot="document-verification-step" className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-[320px_1fr]">
			<div className="flex flex-col justify-between gap-10 border-b border-border bg-background-alt px-8 py-10 lg:border-b-0 lg:border-r">
				<div className="flex flex-col gap-4">
					<span className="font-display text-lg font-bold text-primary">MonitoraGov</span>
					<h1 className="font-display text-2xl font-bold text-foreground">Verificação de documentos</h1>
					<p className="text-sm text-foreground-subtle">
						To ensure compliance and transparency in public procurement, we require formal verification of your SME
						status. This secure upload process protects your data while validating your eligibility for government
						contracts.
					</p>
				</div>

				<p className="text-xs text-foreground-subtle">© 2026 MonitoraGov. Data secured via AES-256 encryption.</p>
			</div>

			<div className="flex flex-col gap-8 px-6 py-10 sm:px-12 lg:px-16">
				<Stepper
					steps={[{ label: 'C' }, { label: 'Company Profile' }, { label: 'Verification' }]}
					currentStep={2}
					align="center"
				/>

				<div className="flex flex-col gap-2">
					<h2 className="font-display text-3xl font-bold text-foreground">Document Verification</h2>
					<p className="text-sm text-foreground-subtle">
						Please upload the required documentation in PDF, JPG, or PNG format. Maximum file size: 10MB per
						document.
					</p>
				</div>

				<div className="flex flex-col gap-5">
					<FileUploadField
						icon={<ShieldCheck />}
						title="SME Certification (ME/EPP Status)"
						description="Official declaration of micro or small enterprise status."
						required
						onFileSelected={setSmeCertification}
					/>
					<FileUploadField
						icon={<FileText />}
						title="Proof of CNPJ"
						description="Current registration status with the Federal Revenue."
						required
						onFileSelected={setProofOfCnpj}
					/>
					<FileUploadField
						icon={<IdCard />}
						title="Legal Representative ID"
						description="Government-issued ID of the authorized signatory."
						required
						onFileSelected={setLegalRepresentativeId}
					/>
				</div>

				<div className="flex items-center justify-between border-t border-border pt-6">
					<Button variant="outline-dark" onClick={onBack}>
						<ArrowLeft />
						Voltar para Informações de Empresa
					</Button>
					<Button variant="primary" onClick={handleSubmit}>
						Enviar requisição
						<CheckCircle2 />
					</Button>
				</div>
			</div>
		</div>
	)
}

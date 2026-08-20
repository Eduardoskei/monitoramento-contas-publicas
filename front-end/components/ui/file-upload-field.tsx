import { useRef, useState, type DragEvent, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { UploadCloud, FileCheck2 } from 'lucide-react'
import { Badge } from './badge'
import { Button } from './button'

export interface FileUploadFieldProps {
	icon: ReactNode
	title: string
	description: string
	required?: boolean
	accept?: string
	onFileSelected?: (file: File | null) => void
	className?: string
}

export function FileUploadField({
	icon,
	title,
	description,
	required,
	accept = '.pdf,.jpg,.jpeg,.png',
	onFileSelected,
	className,
}: FileUploadFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [file, setFile] = useState<File | null>(null)
	const [dragging, setDragging] = useState(false)

	function handleFiles(fileList: FileList | null) {
		const next = fileList?.[0] ?? null
		setFile(next)
		onFileSelected?.(next)
	}

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault()
		setDragging(false)
		handleFiles(event.dataTransfer.files)
	}

	return (
		<div data-slot="file-upload-field" className={twMerge('flex flex-col gap-3 rounded-lg border border-border bg-surface p-5', className)}>
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-2">
					<span className="flex items-center text-primary [&_svg]:size-4">{icon}</span>
					<h4 className="font-display text-base font-semibold text-foreground">{title}</h4>
				</div>
				{required ? <Badge variant="light">Required</Badge> : null}
			</div>

			<p className="text-sm text-foreground-subtle">{description}</p>

			<div
				data-slot="file-upload-dropzone"
				data-dragging={dragging ? '' : undefined}
				data-filled={file ? '' : undefined}
				onDragOver={(event) => {
					event.preventDefault()
					setDragging(true)
				}}
				onDragLeave={() => setDragging(false)}
				onDrop={handleDrop}
				className={twMerge(
					'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-input bg-background-alt/40 px-6 py-10 text-center transition-colors',
					'data-dragging:border-primary data-dragging:bg-primary-soft',
					'data-filled:border-primary data-filled:bg-primary-soft',
				)}
			>
				{file ? (
					<>
						<FileCheck2 className="size-8 text-primary" />
						<p className="text-sm font-medium text-foreground">{file.name}</p>
					</>
				) : (
					<>
						<UploadCloud className="size-8 text-foreground-subtle" />
						<p className="text-sm text-foreground-subtle">Drag and drop file here, or click to browse</p>
					</>
				)}

				<Button
					variant="outline"
					size="sm"
					onClick={() => inputRef.current?.click()}
				>
					{file ? 'Replace file' : 'Upload file'}
				</Button>

				<input
					ref={inputRef}
					type="file"
					accept={accept}
					className="hidden"
					onChange={(event) => handleFiles(event.target.files)}
					aria-label={title}
				/>
			</div>
		</div>
	)
}

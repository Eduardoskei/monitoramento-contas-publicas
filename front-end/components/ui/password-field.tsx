import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { TextField, type TextFieldProps } from './text-field'

export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing'>

export function PasswordField(props: PasswordFieldProps) {
	const [visible, setVisible] = useState(false)

	return (
		<TextField
			{...props}
			type={visible ? 'text' : 'password'}
			trailing={
				<button
					type="button"
					aria-label={visible ? 'Hide password' : 'Show password'}
					onClick={() => setVisible((v) => !v)}
					className="flex items-center justify-center text-foreground-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
				>
					{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
				</button>
			}
		/>
	)
}

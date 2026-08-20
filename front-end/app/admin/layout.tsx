import type { ReactNode } from 'react'
import { Sidebar } from '@/components/admin/sidebar'
import { Topbar } from '@/components/admin/topbar'

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<div data-slot="admin-shell" className="flex h-screen overflow-hidden bg-background">
			<Sidebar />
			<div className="flex min-w-0 flex-1 flex-col">
				<Topbar />
				<main data-slot="admin-content" className="flex-1 overflow-y-auto px-8 py-8">
					{children}
				</main>
			</div>
		</div>
	)
}
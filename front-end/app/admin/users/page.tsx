import { UserDirectoryTable } from '@/components/admin/users/user-table'
import { SecurityLogsCard } from '@/components/admin/users/security-logs'

export default function UsersPage() {
	return (
		<div data-slot="users-page" className="flex flex-col gap-8">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<UserDirectoryTable />
				</div>

				<div className="flex flex-col gap-6">
					<SecurityLogsCard />
				</div>
			</div>
		</div>
	)
}
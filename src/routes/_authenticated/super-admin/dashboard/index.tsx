import { createFileRoute } from '@tanstack/react-router'
import { SuperAdminDashboard } from '@/features/super-admin/dashboard'

export const Route = createFileRoute('/_authenticated/super-admin/dashboard/')({
  component: SuperAdminDashboard,
})

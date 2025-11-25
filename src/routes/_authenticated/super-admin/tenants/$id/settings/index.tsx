import { createFileRoute } from '@tanstack/react-router'
import { TenantSettings } from '@/features/super-admin/tenants/settings'

export const Route = createFileRoute('/_authenticated/super-admin/tenants/$id/settings/')({
  component: TenantSettings,
})

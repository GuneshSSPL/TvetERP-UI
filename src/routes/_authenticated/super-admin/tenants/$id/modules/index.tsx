import { createFileRoute } from '@tanstack/react-router'
import { TenantModules } from '@/features/super-admin/tenants/modules'

export const Route = createFileRoute('/_authenticated/super-admin/tenants/$id/modules/')({
  component: TenantModules,
})


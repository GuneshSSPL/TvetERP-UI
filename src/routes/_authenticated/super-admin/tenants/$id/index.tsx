import { createFileRoute } from '@tanstack/react-router'
import { TenantDetails } from '@/features/super-admin/tenants/details'

export const Route = createFileRoute('/_authenticated/super-admin/tenants/$id/')({
  component: TenantDetails,
})

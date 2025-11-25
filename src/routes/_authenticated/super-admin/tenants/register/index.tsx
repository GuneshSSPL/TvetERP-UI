import { createFileRoute } from '@tanstack/react-router'
import { TenantRegistration } from '@/features/super-admin/tenants/register'

export const Route = createFileRoute('/_authenticated/super-admin/tenants/register/')({
  component: TenantRegistration,
})

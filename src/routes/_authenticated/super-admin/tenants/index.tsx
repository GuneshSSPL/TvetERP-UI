import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { TenantsList } from '@/features/super-admin/tenants'

const tenantsSearchSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended', 'trial']).optional().catch(undefined),
  plan: z.enum(['free', 'basic', 'premium', 'enterprise']).optional().catch(undefined),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/super-admin/tenants/')({
  validateSearch: tenantsSearchSchema,
  component: TenantsList,
})

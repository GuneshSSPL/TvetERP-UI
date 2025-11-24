import { createFileRoute } from '@tanstack/react-router'
import { AdminDemo } from '@/features/admin-demo'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: AdminDemo,
})

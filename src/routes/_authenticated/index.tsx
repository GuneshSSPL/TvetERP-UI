import { createFileRoute } from '@tanstack/react-router'
import { MainDashboard } from '@/features/main-dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: MainDashboard,
})

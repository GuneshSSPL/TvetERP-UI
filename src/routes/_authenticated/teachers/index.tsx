import { createFileRoute } from '@tanstack/react-router'
import { TeachersDemo } from '@/features/teachers-demo'

export const Route = createFileRoute('/_authenticated/teachers/')({
  component: TeachersDemo,
})

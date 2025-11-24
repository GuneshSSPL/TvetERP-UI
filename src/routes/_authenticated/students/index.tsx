import { createFileRoute } from '@tanstack/react-router'
import { StudentsDemo } from '@/features/students-demo'

export const Route = createFileRoute('/_authenticated/students/')({
  component: StudentsDemo,
})

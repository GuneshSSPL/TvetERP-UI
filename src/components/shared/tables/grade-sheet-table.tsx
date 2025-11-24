/**
 * Grade Sheet Table Component
 * 
 * Specialized table for grade entry and viewing:
 * - Student names in rows
 * - Assessment types in columns
 * - Inline editing for grades
 * - Competency tracking (C/NYC)
 * 
 * Features:
 * - Spreadsheet-like interface
 * - Inline grade entry
 * - Color-coded grades
 * - Export functionality
 * 
 * @see Tvet Erp Requirements Questions (6).txt Section 4.6.2
 */

import { type ColumnDef } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SmartTable } from '../smart-table'
import { cn } from '@/lib/utils'

export interface GradeData {
  id: string
  studentName: string
  studentId: string
  cat1?: number
  cat2?: number
  practical?: number
  final?: number
  total?: number
  grade?: string
  competency?: 'C' | 'NYC'
}

interface GradeSheetTableProps {
  /** Grade data */
  data: GradeData[]
  /** Assessment type (CAT, OSCE, Practical, Summative) */
  assessmentType?: string
  /** Whether table is editable */
  editable?: boolean
  /** Save handler for grade changes */
  onGradeChange?: (studentId: string, assessment: string, grade: number) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Grade Sheet Table Component
 * 
 * Perfect for teachers entering grades and viewing student performance.
 */
export function GradeSheetTable({
  data,
  assessmentType = 'Assessment',
  editable = false,
  onGradeChange,
  className,
}: GradeSheetTableProps) {
  const getGradeColor = (grade?: string) => {
    if (!grade) return ''
    const numGrade = parseFloat(grade)
    if (numGrade >= 70) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (numGrade >= 60) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (numGrade >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const getCompetencyColor = (competency?: string) => {
    if (competency === 'C') return 'bg-green-500'
    if (competency === 'NYC') return 'bg-red-500'
    return 'bg-gray-300'
  }

  const columns: ColumnDef<GradeData>[] = [
    {
      accessorKey: 'studentName',
      header: 'Student Name',
      cell: ({ row }) => (
        <div>
          <div className='font-medium'>{row.original.studentName}</div>
          <div className='text-xs text-muted-foreground'>
            {row.original.studentId}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'cat1',
      header: 'CAT 1',
      cell: ({ row }) => {
        const value = row.original.cat1
        if (editable) {
          return (
            <Input
              type='number'
              min={0}
              max={100}
              value={value ?? ''}
              onChange={(e) =>
                onGradeChange?.(
                  row.original.id,
                  'cat1',
                  Number(e.target.value)
                )
              }
              className='w-20 bg-background hover:bg-background focus:bg-background'
            />
          )
        }
        return <span>{value ?? '-'}</span>
      },
    },
    {
      accessorKey: 'cat2',
      header: 'CAT 2',
      cell: ({ row }) => {
        const value = row.original.cat2
        if (editable) {
          return (
            <Input
              type='number'
              min={0}
              max={100}
              value={value ?? ''}
              onChange={(e) =>
                onGradeChange?.(
                  row.original.id,
                  'cat2',
                  Number(e.target.value)
                )
              }
              className='w-20 bg-background hover:bg-background focus:bg-background'
            />
          )
        }
        return <span>{value ?? '-'}</span>
      },
    },
    {
      accessorKey: 'practical',
      header: 'Practical',
      cell: ({ row }) => {
        const value = row.original.practical
        if (editable) {
          return (
            <Input
              type='number'
              min={0}
              max={100}
              value={value ?? ''}
              onChange={(e) =>
                onGradeChange?.(
                  row.original.id,
                  'practical',
                  Number(e.target.value)
                )
              }
              className='w-20 bg-background hover:bg-background focus:bg-background'
            />
          )
        }
        return <span>{value ?? '-'}</span>
      },
    },
    {
      accessorKey: 'final',
      header: 'Final',
      cell: ({ row }) => {
        const value = row.original.final
        if (editable) {
          return (
            <Input
              type='number'
              min={0}
              max={100}
              value={value ?? ''}
              onChange={(e) =>
                onGradeChange?.(
                  row.original.id,
                  'final',
                  Number(e.target.value)
                )
              }
              className='w-20 bg-background hover:bg-background focus:bg-background'
            />
          )
        }
        return <span>{value ?? '-'}</span>
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => {
        const total = row.original.total
        return (
          <span className={cn('font-semibold', getGradeColor(String(total)))}>
            {total ?? '-'}
          </span>
        )
      },
    },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: ({ row }) => {
        const grade = row.original.grade
        return grade ? (
          <Badge className={getGradeColor(grade)}>{grade}</Badge>
        ) : (
          '-'
        )
      },
    },
    {
      accessorKey: 'competency',
      header: 'Competency',
      cell: ({ row }) => {
        const competency = row.original.competency
        return competency ? (
          <Badge
            className={cn(
              'text-white',
              getCompetencyColor(competency)
            )}
          >
            {competency}
          </Badge>
        ) : (
          '-'
        )
      },
    },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>{assessmentType}</h3>
          <p className='text-sm text-muted-foreground'>
            {editable ? 'Enter grades below' : 'View grades'}
          </p>
        </div>
      </div>
      <SmartTable data={data} columns={columns} searchKey='studentName' />
    </div>
  )
}


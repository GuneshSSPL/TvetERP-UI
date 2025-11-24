/**
 * Attendance Table Component
 * 
 * Specialized table for attendance tracking:
 * - Student names in rows
 * - Dates in columns
 * - Quick mark present/absent
 * - Attendance statistics
 * 
 * Features:
 * - Quick attendance marking
 * - Color-coded attendance status
 * - Attendance percentage calculation
 * - Export functionality
 * 
 * @see Tvet Erp Requirements Questions (6).txt Section 4.3, 5.3
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Minus } from 'lucide-react'
import { SmartTable } from '../smart-table'
import { cn } from '@/lib/utils'

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'not-marked'

export interface AttendanceData {
  id: string
  studentName: string
  studentId: string
  [date: string]: string | AttendanceStatus | undefined
}

interface AttendanceTableProps {
  /** Attendance data */
  data: AttendanceData[]
  /** Dates to show in columns */
  dates: string[]
  /** Whether table is editable */
  editable?: boolean
  /** Attendance change handler */
  onAttendanceChange?: (
    studentId: string,
    date: string,
    status: AttendanceStatus
  ) => void
  /** Show attendance percentage */
  showPercentage?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Attendance Table Component
 * 
 * Perfect for teachers marking attendance and viewing attendance records.
 */
export function AttendanceTable({
  data,
  dates,
  editable = false,
  onAttendanceChange,
  showPercentage = true,
  className,
}: AttendanceTableProps) {
  const getStatusColor = (status?: AttendanceStatus | string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'late':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'excused':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status?: AttendanceStatus | string) => {
    switch (status) {
      case 'present':
        return <Check className='h-4 w-4' />
      case 'absent':
        return <X className='h-4 w-4' />
      case 'late':
        return <Minus className='h-4 w-4' />
      default:
        return null
    }
  }

  const calculateAttendancePercentage = (student: AttendanceData): number => {
    let present = 0
    let total = 0
    dates.forEach((date) => {
      const status = student[date] as AttendanceStatus | undefined
      if (status && status !== 'not-marked') {
        total++
        if (status === 'present' || status === 'excused') {
          present++
        }
      }
    })
    return total > 0 ? Math.round((present / total) * 100) : 0
  }

  const baseColumns: ColumnDef<AttendanceData>[] = [
    {
      accessorKey: 'studentName',
      header: 'Student',
      cell: ({ row }) => (
        <div>
          <div className='font-medium'>{row.original.studentName}</div>
          <div className='text-xs text-muted-foreground'>
            {row.original.studentId}
          </div>
        </div>
      ),
    },
  ]

  const dateColumns: ColumnDef<AttendanceData>[] = dates.map((date) => ({
    accessorKey: date,
    header: new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    cell: ({ row }) => {
      const status = row.original[date] as AttendanceStatus | undefined
      if (editable) {
        return (
          <div className='flex gap-1'>
            <Button
              size='sm'
              variant={status === 'present' ? 'default' : 'outline'}
              onClick={() =>
                onAttendanceChange?.(row.original.id, date, 'present')
              }
              className='h-7 w-7 p-0'
            >
              <Check className='h-3 w-3' />
            </Button>
            <Button
              size='sm'
              variant={status === 'absent' ? 'destructive' : 'outline'}
              onClick={() =>
                onAttendanceChange?.(row.original.id, date, 'absent')
              }
              className='h-7 w-7 p-0'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
        )
      }
      return (
        <Badge className={cn('text-xs', getStatusColor(status))}>
          {getStatusIcon(status)}
          <span className='ml-1 capitalize'>{status || 'Not Marked'}</span>
        </Badge>
      )
    },
  }))

  const percentageColumn: ColumnDef<AttendanceData>[] = showPercentage
    ? [
        {
          id: 'percentage',
          header: 'Attendance %',
          cell: ({ row }) => {
            const percentage = calculateAttendancePercentage(row.original)
            return (
              <Badge
                className={cn(
                  percentage >= 80
                    ? 'bg-green-100 text-green-800'
                    : percentage >= 60
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                )}
              >
                {percentage}%
              </Badge>
            )
          },
        },
      ]
    : []

  const columns = [...baseColumns, ...dateColumns, ...percentageColumn]

  return (
    <div className={cn('space-y-4', className)}>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Attendance Record</h3>
          <p className='text-sm text-muted-foreground'>
            {editable ? 'Mark attendance below' : 'View attendance records'}
          </p>
        </div>
      </div>
      <SmartTable data={data} columns={columns} searchKey='studentName' />
    </div>
  )
}


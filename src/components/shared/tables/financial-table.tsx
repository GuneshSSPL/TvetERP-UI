/**
 * Financial Table Component
 * 
 * Specialized table for financial data:
 * - Fee statements
 * - Payment tracking
 * - Invoice lists
 * - Financial reports
 * 
 * Features:
 * - Currency formatting
 * - Payment status indicators
 * - Balance calculations
 * - Export functionality
 * 
 * @see Tvet Erp Requirements Questions (6).txt Section 5.1
 */

import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { SmartTable } from '../smart-table'
import { StatusBadge } from '../status-badge'
import { cn } from '@/lib/utils'

export interface FinancialData {
  id: string
  reference: string
  description: string
  amount: number
  paid: number
  balance: number
  dueDate: string
  status: 'paid' | 'partial' | 'pending' | 'overdue'
  paymentMethod?: string
}

interface FinancialTableProps {
  /** Financial data */
  data: FinancialData[]
  /** Currency symbol */
  currency?: string
  /** Show payment actions */
  showActions?: boolean
  /** Payment handler */
  onPayment?: (id: string) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Financial Table Component
 * 
 * Perfect for students viewing fee statements and finance staff managing payments.
 */
export function FinancialTable({
  data,
  currency = 'KES',
  showActions = false,
  onPayment,
  className,
}: FinancialTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return ''
    }
  }

  const columns: ColumnDef<FinancialData>[] = [
    {
      accessorKey: 'reference',
      header: 'Reference',
      cell: ({ row }) => (
        <div className='font-medium'>{row.original.reference}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className='max-w-[300px] truncate'>{row.original.description}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className='font-semibold'>{formatCurrency(row.original.amount)}</div>
      ),
    },
    {
      accessorKey: 'paid',
      header: 'Paid',
      cell: ({ row }) => (
        <div className='text-green-600 dark:text-green-400'>
          {formatCurrency(row.original.paid)}
        </div>
      ),
    },
    {
      accessorKey: 'balance',
      header: 'Balance',
      cell: ({ row }) => {
        const balance = row.original.balance
        return (
          <div
            className={cn(
              'font-semibold',
              balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            )}
          >
            {formatCurrency(balance)}
          </div>
        )
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => (
        <div className='text-sm'>
          {new Date(row.original.dueDate).toLocaleDateString('en-KE')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => (
        <div className='text-sm text-muted-foreground'>
          {row.original.paymentMethod || '-'}
        </div>
      ),
    },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Financial Records</h3>
          <p className='text-sm text-muted-foreground'>
            View and manage financial transactions
          </p>
        </div>
      </div>
      <SmartTable data={data} columns={columns} searchKey='reference' />
    </div>
  )
}


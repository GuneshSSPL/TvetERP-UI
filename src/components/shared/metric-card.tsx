import { type LucideIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='text-sm font-medium text-muted-foreground'>
          {title}
        </div>
        <Icon className='h-4 w-4 text-primary' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
      </CardContent>
      {trend && (
        <CardFooter className='pt-0'>
          <div
            className={cn(
              'flex items-center text-xs',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className='mr-1 h-3 w-3' />
            ) : (
              <TrendingDown className='mr-1 h-3 w-3' />
            )}
            {Math.abs(trend.value)}% from last period
          </div>
        </CardFooter>
      )}
    </Card>
  )
}


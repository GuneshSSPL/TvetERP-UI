import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, XCircle, Archive, CheckCircle, MinusCircle } from 'lucide-react'

type Status =
  | 'active'
  | 'pending'
  | 'rejected'
  | 'archived'
  | 'completed'
  | 'inactive'

interface StatusBadgeProps {
  status: Status | string
  className?: string
  showIcon?: boolean
}

const statusConfig: Record<
  Status,
  { 
    label: string
    borderColor: string
    textColor: string
    icon?: React.ComponentType<{ className?: string }>
  }
> = {
  active: { 
    label: 'Active', 
    borderColor: 'border-primary',
    textColor: 'text-primary',
    icon: CheckCircle2,
  },
  pending: { 
    label: 'Pending', 
    borderColor: 'border-secondary',
    textColor: 'text-secondary',
    icon: Clock,
  },
  rejected: { 
    label: 'Rejected', 
    borderColor: 'border-destructive',
    textColor: 'text-destructive',
    icon: XCircle,
  },
  completed: { 
    label: 'Completed', 
    borderColor: 'border-tertiary',
    textColor: 'text-tertiary',
    icon: CheckCircle,
  },
  archived: { 
    label: 'Archived', 
    borderColor: 'border-muted',
    textColor: 'text-muted-foreground',
    icon: Archive,
  },
  inactive: { 
    label: 'Inactive', 
    borderColor: 'border-muted/50',
    textColor: 'text-muted-foreground/70',
    icon: MinusCircle,
  },
}

export function StatusBadge({ status, className, showIcon = false }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as Status
  const config =
    statusConfig[normalizedStatus] || { 
      label: status, 
      borderColor: 'border-primary',
      textColor: 'text-primary',
    }

  const Icon = config.icon

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'bg-background border-2',
        config.borderColor,
        config.textColor,
        className
      )}
    >
      {showIcon && Icon && <Icon className="size-3 mr-1" />}
      {config.label}
    </Badge>
  )
}


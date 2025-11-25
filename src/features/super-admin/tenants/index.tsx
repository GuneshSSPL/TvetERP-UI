import { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableToolbar } from '@/components/data-table/toolbar'
import { DataTablePagination } from '@/components/data-table/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { MoreHorizontal, Eye, Edit, Trash2, Play, Pause, Plus } from 'lucide-react'
import { getTenants, updateTenantStatus, deleteTenant } from '@/lib/api/super-admin'
import type { Tenant, TenantStatus, TenantPlan } from '@/lib/types/tenant'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Route } from '@/routes/_authenticated/super-admin/tenants'

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: GET /api/super-admin/tenants?status=active&plan=premium&search=abc
 * Query Parameters: status, plan, search
 * Expected Response: { tenants: Tenant[], total: number }
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export function TenantsList() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [statusFilter, setStatusFilter] = useState<TenantStatus | 'all'>('all')
  const [planFilter, setPlanFilter] = useState<TenantPlan | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null)

  useEffect(() => {
    loadTenants()
  }, [statusFilter, planFilter, searchQuery])

  async function loadTenants() {
    setIsLoading(true)
    try {
      const filters: any = {}
      if (statusFilter !== 'all') filters.status = statusFilter
      if (planFilter !== 'all') filters.plan = planFilter
      if (searchQuery) filters.search = searchQuery

      const result = await getTenants(filters)
      if (result.tenants) {
        setTenants(result.tenants)
      }
    } catch (error) {
      toast.error('Failed to load tenants')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleStatusChange(tenantId: string, newStatus: TenantStatus) {
    try {
      const result = await updateTenantStatus(tenantId, newStatus)
      if (result.success) {
        toast.success('Tenant status updated')
        loadTenants()
      } else {
        toast.error(result.error || 'Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update tenant status')
    }
  }

  async function handleDelete(tenantId: string) {
    try {
      const result = await deleteTenant(tenantId)
      if (result.success) {
        toast.success('Tenant deleted')
        loadTenants()
      } else {
        toast.error(result.error || 'Failed to delete tenant')
      }
    } catch (error) {
      toast.error('Failed to delete tenant')
    }
    setDeleteDialogOpen(false)
    setTenantToDelete(null)
  }

  const statusBadgeVariant = (status: TenantStatus) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'trial':
        return 'secondary'
      case 'suspended':
        return 'destructive'
      case 'inactive':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const planBadgeVariant = (plan: TenantPlan) => {
    switch (plan) {
      case 'enterprise':
        return 'default'
      case 'premium':
        return 'default'
      case 'basic':
        return 'secondary'
      case 'free':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const columns: ColumnDef<Tenant>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const tenant = row.original
          return (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {tenant.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium">{tenant.name}</div>
                <div className="text-sm text-muted-foreground">{tenant.subdomain}</div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'subdomain',
        header: 'Subdomain',
        cell: ({ row }) => (
          <code className="text-sm bg-muted px-2 py-1 rounded">{row.original.subdomain}</code>
        ),
      },
      {
        accessorKey: 'plan',
        header: 'Plan',
        cell: ({ row }) => (
          <Badge variant={planBadgeVariant(row.original.plan)}>
            {row.original.plan}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={statusBadgeVariant(row.original.status)}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'features',
        header: 'Modules',
        cell: ({ row }) => {
          const modules = row.original.features || []
          return (
            <span className="text-sm text-muted-foreground">
              {modules.length} enabled
            </span>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => {
          const date = row.original.createdAt
          return date ? new Date(date).toLocaleDateString() : 'N/A'
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const tenant = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/super-admin/tenants/$id" params={{ id: tenant.id }}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/super-admin/tenants/$id/settings" params={{ id: tenant.id }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {tenant.status === 'active' ? (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(tenant.id, 'suspended')}
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Suspend
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(tenant.id, 'active')}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Activate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    setTenantToDelete(tenant.id)
                    setDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: tenants,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground mt-1">
            Manage all registered institutions and their configurations
          </p>
        </div>
        <Button asChild>
          <Link to="/super-admin/tenants/register">
            <Plus className="mr-2 h-4 w-4" />
            Register New Tenant
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={planFilter} onValueChange={(value) => setPlanFilter(value as any)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1">
          <DataTableToolbar
            table={table}
            searchPlaceholder="Search tenants..."
            searchKey="name"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No tenants found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <DataTablePagination table={table} />
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Tenant"
        desc="Are you sure you want to delete this tenant? This action cannot be undone."
        confirmText="Delete"
        destructive
        handleConfirm={() => {
          if (tenantToDelete) {
            handleDelete(tenantToDelete)
          }
        }}
      />
    </div>
  )
}


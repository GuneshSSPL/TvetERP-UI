import { useEffect, useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/shared/metric-card'
import { BarChart, PieChart } from '@/components/shared/charts'
import { Building2, Users, Clock, AlertTriangle, Plus, ArrowRight } from 'lucide-react'
import { getDashboardStats, getTenants } from '@/lib/api/super-admin'
import type { DashboardStats } from '@/lib/mock-data/tenants'
import type { Tenant } from '@/lib/types/tenant'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: GET /api/super-admin/dashboard/stats
 * Expected Response: DashboardStats
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export function SuperAdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentTenants, setRecentTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [statsResult, tenantsResult] = await Promise.all([
          getDashboardStats(),
          getTenants(),
        ])

        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data)
        }

        if (tenantsResult.tenants) {
          // Get 5 most recent tenants
          const recent = tenantsResult.tenants
            .sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
              return dateB - dateA
            })
            .slice(0, 5)
          setRecentTenants(recent)
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const planChartData = stats
    ? Object.entries(stats.tenantsByPlan)
        .filter(([_, count]) => count > 0)
        .map(([plan, count]) => ({
          name: plan.charAt(0).toUpperCase() + plan.slice(1),
          value: count,
        }))
    : []

  const statusChartData = stats
    ? Object.entries(stats.tenantsByStatus)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          count,
        }))
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage tenants and monitor system-wide metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/super-admin/tenants/register">
              <Plus className="mr-2 h-4 w-4" />
              Register New Tenant
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/super-admin/tenants">
              View All Tenants
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Tenants"
              value={stats?.totalTenants || 0}
              icon={Building2}
            />
            <MetricCard
              title="Active Tenants"
              value={stats?.activeTenants || 0}
              icon={Users}
            />
            <MetricCard
              title="Trial Tenants"
              value={stats?.trialTenants || 0}
              icon={Clock}
            />
            <MetricCard
              title="Suspended"
              value={stats?.suspendedTenants || 0}
              icon={AlertTriangle}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
          </>
        ) : (
          <>
            <PieChart
              title="Tenants by Plan"
              description="Distribution of subscription plans"
              data={planChartData}
              height={300}
            />
            <BarChart
              title="Tenants by Status"
              description="Current status distribution"
              data={statusChartData}
              dataKeys={['count']}
              height={300}
            />
          </>
        )}
      </div>

      {/* Recent Tenants */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tenant Registrations</CardTitle>
          <CardDescription>Last 5 registered tenants</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : recentTenants.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No tenants registered yet</p>
          ) : (
            <div className="space-y-2">
              {recentTenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate({ to: '/super-admin/tenants/$id', params: { id: tenant.id } })}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-muted-foreground">{tenant.subdomain}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{tenant.plan}</p>
                    <p className="text-xs text-muted-foreground">
                      {tenant.createdAt
                        ? new Date(tenant.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


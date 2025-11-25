import { useEffect, useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Edit, Database, Package, Calendar, ArrowLeft } from 'lucide-react'
import { getTenantById } from '@/lib/api/super-admin'
import type { Tenant, TenantModule } from '@/lib/types/tenant'
import { Skeleton } from '@/components/ui/skeleton'
import { Route } from '@/routes/_authenticated/super-admin/tenants/$id'

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: GET /api/super-admin/tenants/[id]
 * Expected Response: { tenant: Tenant, modules: TenantModule[] }
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export function TenantDetails() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [modules, setModules] = useState<TenantModule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTenant()
  }, [id])

  async function loadTenant() {
    setIsLoading(true)
    try {
      const result = await getTenantById(id)
      if (result.tenant) {
        setTenant(result.tenant)
      }
      if (result.modules) {
        setModules(result.modules)
      }
    } catch (error) {
      console.error('Failed to load tenant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statusBadgeVariant = (status: string) => {
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

  const planBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'enterprise':
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Not Found</h1>
          <p className="text-muted-foreground mt-1">The requested tenant could not be found.</p>
        </div>
        <Button asChild>
          <Link to="/super-admin/tenants">Back to Tenants</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/super-admin/tenants">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
            <p className="text-muted-foreground mt-1">
              {tenant.displayName || tenant.subdomain}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/super-admin/tenants/$id/settings" params={{ id: tenant.id }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">
            Modules
            <Badge variant="secondary" className="ml-2">
              {modules.filter((m) => m.enabled).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="mr-2 h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <Calendar className="mr-2 h-4 w-4" />
            Subscription
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{tenant.name}</p>
                </div>
                {tenant.displayName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Display Name</p>
                    <p className="font-medium">{tenant.displayName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Subdomain</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {tenant.subdomain}
                  </code>
                </div>
                {tenant.domain && (
                  <div>
                    <p className="text-sm text-muted-foreground">Domain</p>
                    <p className="font-medium">{tenant.domain}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status & Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={statusBadgeVariant(tenant.status)} className="mt-1">
                    {tenant.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <Badge variant={planBadgeVariant(tenant.plan)} className="mt-1">
                    {tenant.plan}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enabled Modules</p>
                  <p className="font-medium">
                    {modules.filter((m) => m.enabled).length} of {modules.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Email</p>
                  <p className="font-medium">{tenant.contactEmail || 'N/A'}</p>
                </div>
                {tenant.contactPhone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Phone</p>
                    <p className="font-medium">{tenant.contactPhone}</p>
                  </div>
                )}
                {tenant.billingEmail && (
                  <div>
                    <p className="text-sm text-muted-foreground">Billing Email</p>
                    <p className="font-medium">{tenant.billingEmail}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
                {tenant.address ? (
                  <div className="space-y-2 text-sm">
                    {tenant.address.street && <p>{tenant.address.street}</p>}
                    <p>
                      {[
                        tenant.address.city,
                        tenant.address.state,
                        tenant.address.postalCode,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {tenant.address.country && <p>{tenant.address.country}</p>}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No address provided</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Localization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Timezone</p>
                  <p className="font-medium">{tenant.timezone || 'UTC'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Locale</p>
                  <p className="font-medium">{tenant.locale || 'en'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-medium">{tenant.currency || 'USD'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tenant.logoUrl && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Logo</p>
                    <img
                      src={tenant.logoUrl}
                      alt={`${tenant.name} logo`}
                      className="h-16 w-auto"
                    />
                  </div>
                )}
                {tenant.primaryColor && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Primary Color</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-8 w-8 rounded border"
                        style={{ backgroundColor: tenant.primaryColor }}
                      />
                      <code className="text-sm">{tenant.primaryColor}</code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>Module Management</CardTitle>
              <CardDescription>
                Enable or disable modules for this tenant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/super-admin/tenants/$id/modules" params={{ id: tenant.id }}>
                  <Package className="mr-2 h-4 w-4" />
                  Manage Modules
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Configuration</CardTitle>
              <CardDescription>Database connection details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Database Name</p>
                  <p className="font-medium font-mono">{tenant.databaseName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Database Host</p>
                  <p className="font-medium font-mono">{tenant.databaseHost || 'localhost'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Database Port</p>
                  <p className="font-medium font-mono">{tenant.databasePort || 5432}</p>
                </div>
              </div>
              <Separator />
              <div>
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  {/* TODO: API Integration - Test database connection */}
                  Test the database connection for this tenant
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Subscription plan and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <Badge variant={planBadgeVariant(tenant.plan)} className="mt-1">
                    {tenant.plan}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={statusBadgeVariant(tenant.status)} className="mt-1">
                    {tenant.status}
                  </Badge>
                </div>
                {tenant.subscriptionStartDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {new Date(tenant.subscriptionStartDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {tenant.subscriptionEndDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {new Date(tenant.subscriptionEndDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {tenant.maxUsers && (
                  <div>
                    <p className="text-sm text-muted-foreground">Max Users</p>
                    <p className="font-medium">{tenant.maxUsers.toLocaleString()}</p>
                  </div>
                )}
                {tenant.maxStorage && (
                  <div>
                    <p className="text-sm text-muted-foreground">Max Storage</p>
                    <p className="font-medium">{tenant.maxStorage} GB</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


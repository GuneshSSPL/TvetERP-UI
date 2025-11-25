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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getTenantById, toggleTenantModule } from '@/lib/api/super-admin'
import { moduleRegistry } from '@/lib/modules/module-registry'
import type { Tenant, TenantModule } from '@/lib/types/tenant'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Route } from '@/routes/_authenticated/super-admin/tenants/$id/modules'

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: POST /api/super-admin/tenants/[id]/modules
 * Request Body: { moduleId: string, enabled: boolean }
 * Expected Response: { module: TenantModule }
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export function TenantModules() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [modules, setModules] = useState<TenantModule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({})

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
        // Initialize module states
        const states: Record<string, boolean> = {}
        result.modules.forEach((m) => {
          states[m.moduleId] = m.enabled
        })
        setModuleStates(states)
      }
    } catch (error) {
      console.error('Failed to load tenant:', error)
      toast.error('Failed to load tenant modules')
    } finally {
      setIsLoading(false)
    }
  }

  function handleModuleToggle(moduleId: string, enabled: boolean) {
    // Optimistic update
    setModuleStates((prev) => ({
      ...prev,
      [moduleId]: enabled,
    }))
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      // Get all modules that need to be updated
      const updates: Promise<any>[] = []

      // Check all modules from registry
      for (const module of moduleRegistry) {
        const currentState = moduleStates[module.id] || false
        const existingModule = modules.find((m) => m.moduleId === module.id)
        const existingState = existingModule?.enabled || false

        // Only update if state changed
        if (currentState !== existingState) {
          updates.push(toggleTenantModule(id, module.id, currentState))
        }
      }

      await Promise.all(updates)
      toast.success('Modules updated successfully')
      // Reload to get fresh data
      await loadTenant()
    } catch (error) {
      toast.error('Failed to update modules')
      console.error(error)
      // Reload to revert optimistic updates
      await loadTenant()
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = () => {
    for (const module of moduleRegistry) {
      const currentState = moduleStates[module.id] || false
      const existingModule = modules.find((m) => m.moduleId === module.id)
      const existingState = existingModule?.enabled || false
      if (currentState !== existingState) {
        return true
      }
    }
    return false
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Not Found</h1>
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
            <Link to="/super-admin/tenants/$id" params={{ id: tenant.id }}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Module Management</h1>
            <p className="text-muted-foreground mt-1">
              Enable or disable modules for {tenant.name}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges() || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moduleRegistry.map((module) => {
          const Icon = module.icon
          const isEnabled = moduleStates[module.id] || false
          const existingModule = modules.find((m) => m.moduleId === module.id)

          return (
            <Card
              key={module.id}
              className={cn(
                'transition-all',
                isEnabled
                  ? 'border-primary bg-primary/5'
                  : 'border-border opacity-75'
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'p-2 rounded-lg',
                        isEnabled ? 'bg-primary/10' : 'bg-muted'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          isEnabled ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{module.name}</CardTitle>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="flex items-center justify-between">
                  <Label htmlFor={`module-${module.id}`} className="cursor-pointer">
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </Label>
                  <Switch
                    id={`module-${module.id}`}
                    checked={isEnabled}
                    onCheckedChange={(checked) => handleModuleToggle(module.id, checked)}
                  />
                </div>
                {existingModule?.enabledAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Enabled on{' '}
                    {new Date(existingModule.enabledAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {moduleRegistry.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No modules available
          </CardContent>
        </Card>
      )}
    </div>
  )
}


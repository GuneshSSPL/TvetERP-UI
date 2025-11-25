import { useEffect, useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ArrowLeft, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { getTenantById, updateTenant } from '@/lib/api/super-admin'
import {
  tenantUpdateSchema,
  type TenantUpdateData,
} from '@/lib/validations/tenant'
import type { Tenant } from '@/lib/types/tenant'
import { Skeleton } from '@/components/ui/skeleton'
import { Route } from '@/routes/_authenticated/super-admin/tenants/$id/settings'

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: PUT /api/super-admin/tenants/[id]
 * Request Body: Partial<Tenant>
 * Expected Response: { ...updatedTenant }
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export function TenantSettings() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    domain: false,
    branding: false,
    contact: false,
    address: false,
    localization: false,
  })

  const form = useForm<TenantUpdateData>({
    resolver: zodResolver(tenantUpdateSchema),
  })

  useEffect(() => {
    loadTenant()
  }, [id])

  async function loadTenant() {
    setIsLoading(true)
    try {
      const result = await getTenantById(id)
      if (result.tenant) {
        setTenant(result.tenant)
        // Populate form with tenant data
        form.reset({
          name: result.tenant.name,
          displayName: result.tenant.displayName || undefined,
          domain: result.tenant.domain || undefined,
          logoUrl: result.tenant.logoUrl || undefined,
          primaryColor: result.tenant.primaryColor || undefined,
          contactEmail: result.tenant.contactEmail,
          contactPhone: result.tenant.contactPhone || undefined,
          billingEmail: result.tenant.billingEmail || undefined,
          address: result.tenant.address || undefined,
          timezone: result.tenant.timezone || undefined,
          locale: result.tenant.locale || undefined,
          currency: result.tenant.currency || undefined,
          maxUsers: result.tenant.maxUsers || undefined,
          maxStorage: result.tenant.maxStorage || undefined,
          subscriptionStartDate: result.tenant.subscriptionStartDate
            ? new Date(result.tenant.subscriptionStartDate)
            : undefined,
          subscriptionEndDate: result.tenant.subscriptionEndDate
            ? new Date(result.tenant.subscriptionEndDate)
            : undefined,
        })
      }
    } catch (error) {
      console.error('Failed to load tenant:', error)
      toast.error('Failed to load tenant settings')
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(data: TenantUpdateData) {
    setIsSaving(true)
    try {
      const result = await updateTenant(id, data)
      if (result.success && result.data) {
        toast.success('Tenant settings updated successfully')
        setTenant(result.data)
      } else {
        toast.error(result.error || 'Failed to update tenant settings')
      }
    } catch (error) {
      toast.error('An error occurred while updating tenant settings')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
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
            <h1 className="text-3xl font-bold tracking-tight">Tenant Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure settings for {tenant.name}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <Collapsible open={openSections.basic} onOpenChange={() => toggleSection('basic')}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>Institution name and display settings</CardDescription>
                    </div>
                    {openSections.basic ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Short name used in the UI (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Domain Section */}
          <Collapsible open={openSections.domain} onOpenChange={() => toggleSection('domain')}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Domain</CardTitle>
                      <CardDescription>Domain configuration (read-only after creation)</CardDescription>
                    </div>
                    {openSections.domain ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div>
                    <FormLabel>Subdomain</FormLabel>
                    <Input value={tenant.subdomain} readOnly className="bg-muted" />
                    <FormDescription>Subdomain cannot be changed after creation</FormDescription>
                  </div>
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Domain</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Branding Section */}
          <Collapsible open={openSections.branding} onOpenChange={() => toggleSection('branding')}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Branding</CardTitle>
                      <CardDescription>Logo and color customization</CardDescription>
                    </div>
                    {openSections.branding ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/logo.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              {...field}
                              className="w-20 h-10"
                            />
                            <Input placeholder="#0ea5e9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Contact Section */}
          <Collapsible open={openSections.contact} onOpenChange={() => toggleSection('contact')}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>Institution contact details</CardDescription>
                    </div>
                    {openSections.contact ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Address Section */}
          <Collapsible open={openSections.address} onOpenChange={() => toggleSection('address')}>
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Address</CardTitle>
                      <CardDescription>Physical address information</CardDescription>
                    </div>
                    {openSections.address ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/County</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Localization Section */}
          <Collapsible
            open={openSections.localization}
            onOpenChange={() => toggleSection('localization')}
          >
            <Card>
              <CollapsibleTrigger className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Localization</CardTitle>
                      <CardDescription>Regional and language settings</CardDescription>
                    </div>
                    {openSections.localization ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                            <SelectItem value="America/New_York">America/New_York</SelectItem>
                            <SelectItem value="Europe/London">Europe/London</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="locale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Locale</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select locale" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="sw">Swahili</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="KES">KES</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link to="/super-admin/tenants/$id" params={{ id: tenant.id }}>
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
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
        </form>
      </Form>
    </div>
  )
}


import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { registerTenant } from '@/lib/api/super-admin'
import {
  tenantRegistrationSchema,
  type TenantRegistrationData,
} from '@/lib/validations/tenant'
import { moduleRegistry } from '@/lib/modules/module-registry'
import { DatePicker } from '@/components/date-picker'
import { cn } from '@/lib/utils'

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: POST /api/super-admin/tenants
 * Request Body: TenantRegistrationData
 * Expected Response: { id: string, ...tenant }
 * Error Handling: Return validation errors or conflict errors (e.g., subdomain exists)
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export function TenantRegistration() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSection, setCurrentSection] = useState(1)
  const totalSections = 9

  const form = useForm<TenantRegistrationData>({
    resolver: zodResolver(tenantRegistrationSchema),
    defaultValues: {
      databaseHost: 'localhost',
      databasePort: 5432,
      plan: 'free',
      timezone: 'UTC',
      locale: 'en',
      currency: 'USD',
      features: [],
    },
  })

  const subdomain = form.watch('subdomain')
  const selectedModules = form.watch('features') || []

  // Auto-generate database name from subdomain
  const generateDatabaseName = (subdomain: string) => {
    if (!subdomain) return ''
    return `tvet_erp_${subdomain.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
  }

  // Update database name when subdomain changes
  const handleSubdomainChange = (value: string) => {
    form.setValue('subdomain', value)
    if (value) {
      form.setValue('databaseName', generateDatabaseName(value))
    }
  }

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    const current = form.getValues('features') || []
    if (checked) {
      form.setValue('features', [...current, moduleId])
    } else {
      form.setValue('features', current.filter((id) => id !== moduleId))
    }
  }

  async function onSubmit(data: TenantRegistrationData) {
    setIsSubmitting(true)
    try {
      const result = await registerTenant(data)
      if (result.success && result.data) {
        toast.success('Tenant registered successfully')
        navigate({ to: '/super-admin/tenants/$id', params: { id: result.data.id } })
      } else {
        toast.error(result.error || 'Failed to register tenant')
      }
    } catch (error) {
      toast.error('An error occurred while registering the tenant')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextSection = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Register New Tenant</h1>
        <p className="text-muted-foreground mt-1">
          Create a new institution account with complete configuration
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex gap-2">
                {Array.from({ length: totalSections }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-2 flex-1 rounded',
                      i + 1 <= currentSection ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Section {currentSection} of {totalSections}
              </p>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          {currentSection === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the institution's basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Technical Institute" {...field} />
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
                        <Input placeholder="ABC Tech" {...field} />
                      </FormControl>
                      <FormDescription>
                        Short name used in the UI (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subdomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subdomain *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="abc"
                          {...field}
                          onChange={(e) => handleSubdomainChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>
                        Unique subdomain for this tenant (e.g., abc.tvet.com)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Section 2: Domain Configuration */}
          {currentSection === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Domain Configuration</CardTitle>
                <CardDescription>Configure custom domain settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Domain</FormLabel>
                      <FormControl>
                        <Input placeholder="abc.tvet.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional custom domain (leave empty to use subdomain)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">Subdomain Preview</p>
                  <code className="text-sm">
                    {subdomain || 'subdomain'}.tvet.com
                  </code>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 3: Database Settings */}
          {currentSection === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Database Settings</CardTitle>
                <CardDescription>Configure database connection details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="databaseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Name *</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormDescription>
                        Auto-generated from subdomain (read-only)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="databaseHost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Host</FormLabel>
                      <FormControl>
                        <Input placeholder="localhost" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="databasePort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Port</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 5432)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Section 4: Subscription */}
          {currentSection === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Configure subscription plan and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Plan *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subscriptionStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={field.value}
                            onSelect={field.onChange}
                            placeholder="Select start date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subscriptionEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={field.value}
                            onSelect={field.onChange}
                            placeholder="Select end date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxUsers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Users</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxStorage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Storage (GB)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 5: Branding */}
          {currentSection === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Configure institution branding</CardDescription>
              </CardHeader>
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
                      <FormDescription>
                        URL to the institution's logo image
                      </FormDescription>
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
                      <FormDescription>
                        Primary brand color in hex format
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Section 6: Contact Information */}
          {currentSection === 6 && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Institution contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@institution.com" {...field} />
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
                        <Input placeholder="+254712345678" {...field} />
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
                        <Input type="email" placeholder="billing@institution.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Section 7: Address */}
          {currentSection === 7 && (
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Institution physical address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
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
                          <Input placeholder="Nairobi" {...field} />
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
                          <Input placeholder="Nairobi County" {...field} />
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
                          <Input placeholder="Kenya" {...field} />
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
                          <Input placeholder="00100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 8: Localization */}
          {currentSection === 8 && (
            <Card>
              <CardHeader>
                <CardTitle>Localization</CardTitle>
                <CardDescription>Regional and language settings</CardDescription>
              </CardHeader>
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
            </Card>
          )}

          {/* Section 9: Modules */}
          {currentSection === 9 && (
            <Card>
              <CardHeader>
                <CardTitle>Initial Module Selection</CardTitle>
                <CardDescription>
                  Select which modules to enable for this tenant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moduleRegistry.map((module) => {
                    const Icon = module.icon
                    const isSelected = selectedModules.includes(module.id)
                    return (
                      <div
                        key={module.id}
                        className={cn(
                          'p-4 border rounded-lg cursor-pointer transition-colors',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                        onClick={() => handleModuleToggle(module.id, !isSelected)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleModuleToggle(module.id, checked as boolean)
                            }
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="h-5 w-5 text-primary" />
                              <span className="font-medium">{module.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 1}
            >
              Previous
            </Button>
            {currentSection < totalSections ? (
              <Button type="button" onClick={nextSection}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Register Tenant
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}


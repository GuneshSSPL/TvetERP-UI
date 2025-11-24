/**
 * Ribbon Navigation Component
 * 
 * Horizontal ribbon navigation system with tabs for Main, Setup, Operations, and Reports.
 * Dynamically renders menu items based on the module registry and user permissions.
 * 
 * Features:
 * - Active tab highlighting based on current route
 * - Responsive mobile drawer variant
 * - Permission-based menu item filtering
 * - Tenant-aware styling (uses bg-primary for active states)
 * 
 * @see tvet-erp-frontend-architecture.plan.md for full architecture details
 */

import { useState, useMemo } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import {
  type RibbonType,
  getMenuItemsForRibbon,
  type ModuleMenuItem,
} from '@/lib/modules/module-registry'
import { usePermission } from '@/hooks/usePermission'
import { filterMenuItemsByPermission } from '@/lib/permissions/permission-checker'
import { cn } from '@/lib/utils'

/**
 * Ribbon labels mapping
 */
const ribbonLabels: Record<RibbonType, string> = {
  main: 'Main',
  setup: 'Setup',
  operations: 'Operations',
  reports: 'Reports',
}

interface RibbonNavigationProps {
  /** Active ribbon (auto-detected from route if not provided) */
  activeRibbon?: RibbonType
  /** Which ribbons to enable (defaults to all) */
  enabledRibbons?: RibbonType[]
  /** Additional CSS classes */
  className?: string
}

/**
 * Ribbon Navigation Component
 * 
 * Renders horizontal ribbon tabs with dynamic menu items from module registry.
 * Automatically highlights active tab based on current route.
 */
export function RibbonNavigation({
  activeRibbon,
  enabledRibbons = ['main', 'setup', 'operations', 'reports'],
  className,
}: RibbonNavigationProps) {
  const location = useLocation()
  const { userPermissions } = usePermission()
  const [activeTab, setActiveTab] = useState<RibbonType>(
    activeRibbon || 'main'
  )

  /**
   * Determine which ribbon should be active based on current route
   */
  const determineActiveRibbon = (): RibbonType => {
    const pathname = location.pathname
    if (pathname.includes('/setup/')) return 'setup'
    if (pathname.includes('/operations/')) return 'operations'
    if (pathname.includes('/reports/')) return 'reports'
    return 'main'
  }

  const currentActiveRibbon = activeRibbon || determineActiveRibbon()

  /**
   * Render menu items for a ribbon
   * Filters items based on user permissions
   */
  const renderMenuItems = (items: ModuleMenuItem[], moduleId: string) => {
    // Filter items based on permissions
    const filteredItems = filterMenuItemsByPermission(
      items,
      userPermissions,
      moduleId
    ) as ModuleMenuItem[]

    if (filteredItems.length === 0) {
      return (
        <div className='px-4 py-8 text-center text-muted-foreground text-sm'>
          No items available in this ribbon
        </div>
      )
    }

    return (
      <div className='border-t border-border bg-background'>
        <div className='max-w-7xl mx-auto px-4 py-2'>
          <div className='flex flex-wrap gap-1'>
            {filteredItems.map((item, index) => {
              const isActive =
                location.pathname === item.href ||
                location.pathname.startsWith(item.href + '/')
              const Icon = item.icon

              return (
                <Button
                  key={`${item.href}-${index}`}
                  asChild
                  variant={isActive ? 'default' : 'ghost'}
                  size='sm'
                  className={cn(
                    'h-8 gap-2',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Link to={item.href}>
                    {Icon && <Icon className='h-4 w-4' />}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className='ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded'>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render ribbon content with menu items
   */
  const renderRibbonContent = (ribbon: RibbonType) => {
    const menuItems = getMenuItemsForRibbon(ribbon, true)

    // For now, we'll render all items. In production, you'd group by module
    // and filter by permissions per module
    return renderMenuItems(menuItems, 'system') // TODO: Get actual module ID
  }

  return (
    <div className={cn('border-b border-border bg-background', className)}>
      <Tabs
        value={currentActiveRibbon}
        onValueChange={(value) => setActiveTab(value as RibbonType)}
        className='w-full'
      >
        <div className='max-w-7xl mx-auto px-4'>
          <TabsList className='h-10 w-full justify-start bg-transparent border-b border-border rounded-none p-0'>
            {enabledRibbons.map((ribbon) => (
              <TabsTrigger
                key={ribbon}
                value={ribbon}
                className={cn(
                  'rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary h-10 px-4',
                  'hover:bg-muted/50'
                )}
              >
                {ribbonLabels[ribbon]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {enabledRibbons.map((ribbon) => (
          <TabsContent key={ribbon} value={ribbon} className='mt-0'>
            {renderRibbonContent(ribbon)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Mobile Navigation Drawer */}
      <div className='lg:hidden border-t border-border'>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-between'
            >
              <span>{ribbonLabels[currentActiveRibbon]}</span>
              <Menu className='h-4 w-4' />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-80'>
            <div className='space-y-4 mt-4'>
              {enabledRibbons.map((ribbon) => {
                const items = getMenuItemsForRibbon(ribbon, true)
                return (
                  <div key={ribbon}>
                    <h3 className='text-sm font-semibold mb-2 px-2'>
                      {ribbonLabels[ribbon]}
                    </h3>
                    <div className='space-y-1'>
                      {items.map((item, index) => {
                        const isActive =
                          location.pathname === item.href ||
                          location.pathname.startsWith(item.href + '/')
                        const Icon = item.icon
                        return (
                          <Link
                            key={`${item.href}-${index}`}
                            to={item.href}
                            className={cn(
                              'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            )}
                          >
                            {Icon && <Icon className='h-4 w-4' />}
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className='ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded'>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}


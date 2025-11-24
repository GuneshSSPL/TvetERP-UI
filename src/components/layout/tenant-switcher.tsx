/**
 * Tenant Switcher Component
 * 
 * Replaces the team switcher with a tenant/institution switcher.
 * Allows users to switch between different TVET institutions,
 * which applies different themes (colors, logos, names) globally.
 * 
 * Features:
 * - Visual institution selection with logos
 * - Global theme application on selection
 * - Keyboard shortcuts (⌘1, ⌘2, ⌘3)
 * - Responsive design (mobile drawer, desktop dropdown)
 * 
 * @see tvet-erp-frontend-architecture.plan.md for architecture details
 */

import * as React from 'react'
import { ChevronsUpDown, Plus, Building2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useTenantTheme } from '@/context/tenant-theme-provider'
import { demoThemes, defaultTheme } from '@/lib/demo-themes'
import { cn } from '@/lib/utils'

/**
 * Tenant Switcher Component
 * 
 * Displays current institution and allows switching between demo institutions.
 * Applies theme globally when institution is changed.
 */
export function TenantSwitcher() {
  const { isMobile } = useSidebar()
  const { config, setTheme } = useTenantTheme()
  const [activeTenant, setActiveTenant] = React.useState(
    demoThemes.find((t) => t.name === config.name) || defaultTheme
  )

  /**
   * Handle tenant selection
   * Updates both local state and global theme
   */
  const handleTenantSelect = (tenant: typeof demoThemes[0]) => {
    setActiveTenant(tenant)
    setTheme(tenant)
  }

  /**
   * Handle keyboard shortcuts
   */
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl + number
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '3') {
        const index = parseInt(e.key) - 1
        if (demoThemes[index]) {
          handleTenantSelect(demoThemes[index])
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              {/* Institution Logo */}
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden'>
                {activeTenant.logoUrl ? (
                  <img
                    src={activeTenant.logoUrl}
                    alt={activeTenant.name}
                    className='size-full object-contain'
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<span class="text-lg">${activeTenant.logo || '🎓'}</span>`
                      }
                    }}
                  />
                ) : (
                  <span className='text-lg'>{activeTenant.logo || '🎓'}</span>
                )}
              </div>
              {/* Institution Name and Type */}
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {activeTenant.name}
                </span>
                <span className='truncate text-xs text-muted-foreground'>
                  TVET Institution
                </span>
              </div>
              <ChevronsUpDown className='ms-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Institutions
            </DropdownMenuLabel>
            {demoThemes.map((tenant, index) => {
              const isActive = tenant.name === activeTenant.name
              return (
                <DropdownMenuItem
                  key={tenant.name}
                  onClick={() => handleTenantSelect(tenant)}
                  className={cn(
                    'gap-2 p-2',
                    isActive && 'bg-accent'
                  )}
                >
                  {/* Institution Logo in Dropdown */}
                  <div
                    className='flex size-8 items-center justify-center rounded-sm border overflow-hidden'
                    style={{
                      borderColor: tenant.colorPalette?.primary || tenant.primaryColor,
                    }}
                  >
                    {tenant.logoUrl ? (
                      <img
                        src={tenant.logoUrl}
                        alt={tenant.name}
                        className='size-full object-contain p-1'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `<span class="text-sm">${tenant.logo || '🎓'}</span>`
                          }
                        }}
                      />
                    ) : (
                      <span className='text-sm'>{tenant.logo || '🎓'}</span>
                    )}
                  </div>
                  {/* Institution Name */}
                  <div className='flex-1'>
                    <div className='font-medium'>{tenant.name}</div>
                    <div
                      className='text-xs text-muted-foreground'
                      style={{ color: tenant.colorPalette?.primary || tenant.primaryColor }}
                    >
                      {tenant.colorPalette?.primary || tenant.primaryColor}
                    </div>
                  </div>
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='bg-background flex size-8 items-center justify-center rounded-md border'>
                <Plus className='size-4' />
              </div>
              <div className='text-muted-foreground font-medium'>
                Add institution
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}


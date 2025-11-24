/**
 * Portal Header Component
 * 
 * Shared header component for all portals (Student, Staff, Admin, Super Admin).
 * Displays tenant branding (logo and name) and user menu.
 * 
 * Features:
 * - Dynamic tenant branding (logo and name from TenantThemeProvider)
 * - User profile dropdown
 * - Theme switcher
 * - Search functionality
 * 
 * @see tvet-erp-frontend-architecture.plan.md for full architecture details
 */

import { Link } from '@tanstack/react-router'
import { useTenantTheme } from '@/context/tenant-theme-provider'
import { Header } from './header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'

interface PortalHeaderProps {
  /** Whether header should be fixed at top */
  fixed?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Portal Header Component
 * 
 * Renders the header for all portals with tenant branding and navigation.
 */
export function PortalHeader({ fixed, className }: PortalHeaderProps) {
  const { config: branding } = useTenantTheme()

  return (
    <Header fixed={fixed} className={className}>
      {/* Tenant Branding */}
      <Link
        to='/'
        className='flex items-center gap-2 hover:opacity-80 transition-opacity'
      >
        {branding?.logoUrl ? (
          <img
            src={branding.logoUrl}
            alt={branding.name || 'TVET ERP'}
            className='h-8 w-8 object-contain'
            onError={(e) => {
              // Fallback to emoji if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                const fallback = document.createElement('div')
                fallback.className = 'h-8 w-8 rounded bg-primary flex items-center justify-center'
                fallback.innerHTML = `<span class="text-primary-foreground text-sm font-bold">${branding?.logo || branding?.name?.[0] || 'T'}</span>`
                parent.insertBefore(fallback, target)
              }
            }}
          />
        ) : (
          <div className='h-8 w-8 rounded bg-primary flex items-center justify-center'>
            <span className='text-primary-foreground text-sm font-bold'>
              {branding?.logo || branding?.name?.[0] || 'T'}
            </span>
          </div>
        )}
        <span className='text-xl font-semibold text-foreground'>
          {branding?.name || 'TVET ERP'}
        </span>
      </Link>

      {/* Right side actions */}
      <div className='ms-auto flex items-center space-x-4'>
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </div>
    </Header>
  )
}


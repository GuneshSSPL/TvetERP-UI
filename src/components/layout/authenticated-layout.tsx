/**
 * Authenticated Layout Component
 * 
 * Main layout wrapper for all authenticated routes.
 * Provides sidebar navigation and optional ribbon navigation.
 * 
 * Features:
 * - Sidebar navigation (existing shadcn-admin sidebar)
 * - Optional ribbon navigation (TVET ERP module-based navigation)
 * - Responsive layout with container queries
 * 
 * @see tvet-erp-frontend-architecture.plan.md for full architecture details
 */

import { Outlet } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'
import { RibbonNavigation } from '@/components/navigation/ribbon-navigation'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
  /** Whether to show ribbon navigation (default: false for backward compatibility) */
  showRibbon?: boolean
}

export function AuthenticatedLayout({
  children,
  showRibbon = false,
}: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-data-[layout=fixed]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            {/* Optional Ribbon Navigation */}
            {showRibbon && <RibbonNavigation />}
            {children ?? <Outlet />}
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}

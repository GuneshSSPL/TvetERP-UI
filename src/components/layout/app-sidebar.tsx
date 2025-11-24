/**
 * App Sidebar Component
 * 
 * Main sidebar navigation with tenant switcher.
 * Uses TenantSwitcher instead of TeamSwitcher for institution selection.
 * 
 * @see tvet-erp-frontend-architecture.plan.md for architecture details
 */

import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TenantSwitcher } from './tenant-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        {/* Tenant Switcher - allows switching between institutions */}
        <TenantSwitcher />

        {/* Replace <TenantSwitcher /> with the following <AppTitle />
         /* if you want to use the normal app title instead of tenant switcher */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

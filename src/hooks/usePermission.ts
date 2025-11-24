/**
 * usePermission Hook
 * 
 * React hook for checking user permissions in components.
 * This hook provides a convenient way to conditionally render UI elements
 * based on user permissions.
 * 
 * @example
 * ```tsx
 * const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()
 * 
 * {hasPermission('academic', 'edit') && (
 *   <Button>Edit Student</Button>
 * )}
 * ```
 */

import { useMemo } from 'react'
import {
  type UserPermissions,
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  canAccessModule,
} from '@/lib/permissions/permission-checker'
import { type Permission } from '@/lib/modules/module-registry'

/**
 * Mock user permissions for demo purposes
 * In production, this would come from auth context or API
 * 
 * TODO: Replace with actual auth context integration
 */
const mockUserPermissions: UserPermissions = {
  academic: ['view', 'add', 'edit', 'delete', 'export'],
  exams: ['view', 'add', 'edit', 'approve', 'export'],
  finance: ['view', 'add', 'edit', 'post', 'print', 'export'],
  hr: ['view', 'add', 'edit', 'delete', 'export'],
  procurement: ['view', 'add', 'edit', 'approve', 'export'],
  library: ['view', 'add', 'edit', 'export'],
  lms: ['view', 'add', 'edit', 'export'],
  system: ['view', 'add', 'edit', 'delete', 'export'],
}

/**
 * Hook for checking user permissions
 * 
 * @param userPermissions - Optional user permissions (defaults to mock for demo)
 * @returns Object with permission checking functions
 */
export function usePermission(
  userPermissions: UserPermissions = mockUserPermissions
) {
  /**
   * Check if user has a specific permission for a module
   */
  const hasPermission = useMemo(
    () => (moduleId: string, permission: Permission) => {
      return checkPermission(userPermissions, moduleId, permission)
    },
    [userPermissions]
  )

  /**
   * Check if user has any of the specified permissions (OR logic)
   */
  const hasAnyPermission = useMemo(
    () => (moduleId: string, permissions: Permission[]) => {
      return checkAnyPermission(userPermissions, moduleId, permissions)
    },
    [userPermissions]
  )

  /**
   * Check if user has all of the specified permissions (AND logic)
   */
  const hasAllPermissions = useMemo(
    () => (moduleId: string, permissions: Permission[]) => {
      return checkAllPermissions(userPermissions, moduleId, permissions)
    },
    [userPermissions]
  )

  /**
   * Check if user can access a module at all (has view permission)
   */
  const canAccess = useMemo(
    () => (moduleId: string) => {
      return canAccessModule(userPermissions, moduleId)
    },
    [userPermissions]
  )

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    userPermissions, // Expose for advanced use cases
  }
}


/**
 * useCanAccess Hook
 * 
 * React hook for checking if a user can access a specific resource or action.
 * This is a convenience wrapper around usePermission for common access patterns.
 * 
 * @example
 * ```tsx
 * const { canView, canEdit, canDelete } = useCanAccess('academic')
 * 
 * {canEdit && <Button>Edit</Button>}
 * ```
 */

import { usePermission } from './usePermission'
import { type Permission } from '@/lib/modules/module-registry'

/**
 * Hook for checking access to specific resources
 * 
 * @param moduleId - Module identifier
 * @returns Object with boolean flags for common permissions
 */
export function useCanAccess(moduleId: string) {
  const { hasPermission } = usePermission()

  return {
    /** Can view/read data */
    canView: hasPermission(moduleId, 'view'),
    /** Can create new records */
    canAdd: hasPermission(moduleId, 'add'),
    /** Can modify existing records */
    canEdit: hasPermission(moduleId, 'edit'),
    /** Can delete records */
    canDelete: hasPermission(moduleId, 'delete'),
    /** Can approve workflows */
    canApprove: hasPermission(moduleId, 'approve'),
    /** Can post transactions (finance) */
    canPost: hasPermission(moduleId, 'post'),
    /** Can print documents */
    canPrint: hasPermission(moduleId, 'print'),
    /** Can export data */
    canExport: hasPermission(moduleId, 'export'),
    /** Can access module at all */
    canAccess: hasPermission(moduleId, 'view'),
  }
}


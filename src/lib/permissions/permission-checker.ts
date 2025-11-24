/**
 * Permission Checker System
 * 
 * This module provides utilities for checking user permissions throughout the application.
 * Permissions are checked at both module-level and action-level granularity.
 * 
 * Architecture:
 * - Permissions are stored per user/role
 * - Module-level permissions control access to entire modules
 * - Action-level permissions control specific operations (view, add, edit, etc.)
 * - UI elements are hidden/disabled based on permissions, not just route protection
 * 
 * @see tvet-erp-frontend-architecture.plan.md for full architecture details
 */

import { type Permission } from '../modules/module-registry'

/**
 * User permission structure
 * Maps module IDs to arrays of permissions the user has
 */
export interface UserPermissions {
  [moduleId: string]: Permission[]
}

/**
 * Check if a user has a specific permission for a module
 * 
 * @param userPermissions - User's permission map
 * @param moduleId - Module identifier
 * @param permission - Permission to check
 * @returns True if user has the permission
 * 
 * @example
 * ```ts
 * const hasView = checkPermission(userPermissions, 'academic', 'view')
 * ```
 */
export function checkPermission(
  userPermissions: UserPermissions,
  moduleId: string,
  permission: Permission
): boolean {
  const modulePermissions = userPermissions[moduleId] || []
  return modulePermissions.includes(permission)
}

/**
 * Check if a user has any of the specified permissions
 * 
 * @param userPermissions - User's permission map
 * @param moduleId - Module identifier
 * @param permissions - Array of permissions to check (OR logic)
 * @returns True if user has at least one of the permissions
 * 
 * @example
 * ```ts
 * const canAccess = checkAnyPermission(userPermissions, 'finance', ['view', 'add'])
 * ```
 */
export function checkAnyPermission(
  userPermissions: UserPermissions,
  moduleId: string,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) =>
    checkPermission(userPermissions, moduleId, permission)
  )
}

/**
 * Check if a user has all of the specified permissions
 * 
 * @param userPermissions - User's permission map
 * @param moduleId - Module identifier
 * @param permissions - Array of permissions to check (AND logic)
 * @returns True if user has all of the permissions
 * 
 * @example
 * ```ts
 * const canEdit = checkAllPermissions(userPermissions, 'academic', ['view', 'edit'])
 * ```
 */
export function checkAllPermissions(
  userPermissions: UserPermissions,
  moduleId: string,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) =>
    checkPermission(userPermissions, moduleId, permission)
  )
}

/**
 * Check if a user can access a module at all
 * 
 * @param userPermissions - User's permission map
 * @param moduleId - Module identifier
 * @returns True if user has at least 'view' permission
 * 
 * @example
 * ```ts
 * const canAccessModule = canAccessModule(userPermissions, 'academic')
 * ```
 */
export function canAccessModule(
  userPermissions: UserPermissions,
  moduleId: string
): boolean {
  return checkPermission(userPermissions, moduleId, 'view')
}

/**
 * Filter menu items based on user permissions
 * 
 * @param items - Array of menu items to filter
 * @param userPermissions - User's permission map
 * @param moduleId - Module identifier
 * @returns Filtered array of menu items the user can access
 * 
 * @example
 * ```ts
 * const visibleItems = filterMenuItemsByPermission(items, userPermissions, 'academic')
 * ```
 */
export function filterMenuItemsByPermission(
  items: Array<{ permissions?: Permission[] }>,
  userPermissions: UserPermissions,
  moduleId: string
): Array<{ permissions?: Permission[] }> {
  return items.filter((item) => {
    // If no permissions specified, allow access
    if (!item.permissions || item.permissions.length === 0) {
      return true
    }

    // Check if user has at least one of the required permissions
    return checkAnyPermission(userPermissions, moduleId, item.permissions)
  })
}


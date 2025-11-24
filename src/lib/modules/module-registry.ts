/**
 * Module Registry System
 * 
 * This file defines the module-based navigation architecture for the TVET ERP system.
 * Each module contributes menu items to specific ribbons (Main, Setup, Operations, Reports).
 * 
 * Architecture:
 * - Modules are self-contained units with their own routes, permissions, and menu contributions
 * - Each module can contribute to multiple ribbons
 * - Menu items are filtered based on user permissions
 * - Modules can be enabled/disabled per tenant
 * 
 * @see tvet-erp-frontend-architecture.plan.md for full architecture details
 */

import {
  GraduationCap,
  FileText,
  DollarSign,
  Users,
  ShoppingCart,
  BookOpen,
  BookMarked,
  Settings,
  BarChart3,
  Home,
  Calendar,
  ClipboardList,
  UserCog,
  Shield,
} from 'lucide-react'

/**
 * Ribbon types available in the navigation system
 * - main: Primary module access and dashboards
 * - setup: Configuration and setup pages
 * - operations: Daily operational tasks
 * - reports: Analytics and reporting
 */
export type RibbonType = 'main' | 'setup' | 'operations' | 'reports'

/**
 * Permission types for granular access control
 * - view: Read-only access
 * - add: Create new records
 * - edit: Modify existing records
 * - delete: Remove records
 * - approve: Approve workflows
 * - post: Post transactions (finance)
 * - print: Print documents
 * - export: Export data
 */
export type Permission =
  | 'view'
  | 'add'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'post'
  | 'print'
  | 'export'

/**
 * Menu item structure for module contributions
 */
export interface ModuleMenuItem {
  /** Display label for the menu item */
  label: string
  /** Route path (TanStack Router compatible) */
  href: string
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Required permissions to see this item */
  permissions?: Permission[]
  /** Optional badge (e.g., notification count) */
  badge?: string | number
}

/**
 * Module configuration structure
 */
export interface ModuleConfig {
  /** Unique module identifier */
  id: string
  /** Display name */
  name: string
  /** Module description */
  description: string
  /** Module icon */
  icon: React.ComponentType<{ className?: string }>
  /** Whether module is enabled (can be tenant-specific) */
  enabled: boolean
  /** Menu contributions per ribbon */
  ribbons: {
    [key in RibbonType]?: ModuleMenuItem[]
  }
  /** Default permissions for this module */
  defaultPermissions: Permission[]
}

/**
 * Module Registry
 * 
 * Central registry of all ERP modules. Each module defines:
 * - Which ribbons it contributes to
 * - What menu items appear in each ribbon
 * - Default permissions required
 * 
 * Modules can be enabled/disabled per tenant without affecting others.
 */
export const moduleRegistry: ModuleConfig[] = [
  {
    id: 'academic',
    name: 'Academic Management',
    description: 'Student admissions, programmes, courses, and academic records',
    icon: GraduationCap,
    enabled: true,
    ribbons: {
      main: [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Students', href: '/users', icon: Users },
        { label: 'Programmes', href: '/admin', icon: BookMarked },
        { label: 'Courses', href: '/admin', icon: BookOpen },
      ],
      setup: [
        { label: 'Programme Setup', href: '/admin' },
        { label: 'Course Setup', href: '/admin' },
        { label: 'Intake Management', href: '/admin' },
      ],
      operations: [
        { label: 'Admissions', href: '/admin' },
        { label: 'Enrollment', href: '/admin' },
        { label: 'Transfers', href: '/admin' },
      ],
      reports: [
        { label: 'Enrollment Report', href: '/admin' },
        { label: 'Student Progress', href: '/admin' },
      ],
    },
    defaultPermissions: ['view', 'add', 'edit', 'delete', 'export'],
  },
  {
    id: 'exams',
    name: 'Exams & Assessments',
    description: 'Exam management, grading, and competency tracking',
    icon: FileText,
    enabled: true,
    ribbons: {
      main: [
        { label: 'Dashboard', href: '/admin', icon: Home },
        { label: 'Assessments', href: '/admin', icon: ClipboardList },
        { label: 'Grade Entry', href: '/admin', icon: FileText },
      ],
      setup: [
        { label: 'Exam Bodies', href: '/admin' },
        { label: 'Assessment Types', href: '/admin' },
        { label: 'Grading Scales', href: '/admin' },
      ],
      operations: [
        { label: 'Grade Entry', href: '/admin' },
        { label: 'Moderation', href: '/admin' },
        { label: 'Results Processing', href: '/admin' },
      ],
      reports: [
        { label: 'Performance Report', href: '/admin' },
        { label: 'Competency Report', href: '/admin' },
      ],
    },
    defaultPermissions: ['view', 'add', 'edit', 'approve', 'export'],
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Fee management, invoicing, and financial reporting',
    icon: DollarSign,
    enabled: true,
    ribbons: {
      main: [
        { label: 'Dashboard', href: '/admin', icon: Home },
        { label: 'Fees', href: '/admin', icon: DollarSign },
        { label: 'Invoices', href: '/admin', icon: FileText },
      ],
      setup: [
        { label: 'Fee Structures', href: '/admin' },
        { label: 'Payment Methods', href: '/admin' },
        { label: 'Sponsors', href: '/admin' },
      ],
      operations: [
        { label: 'Fee Collection', href: '/admin' },
        { label: 'Receipts', href: '/admin' },
        { label: 'Refunds', href: '/admin' },
      ],
      reports: [
        { label: 'Fee Arrears', href: '/admin' },
        { label: 'Collection Report', href: '/admin' },
      ],
    },
    defaultPermissions: ['view', 'add', 'edit', 'post', 'print', 'export'],
  },
  {
    id: 'hr',
    name: 'Human Resources',
    description: 'Staff management, payroll, and attendance',
    icon: Users,
    enabled: true,
    ribbons: {
      main: [
        { label: 'Dashboard', href: '/admin', icon: Home },
        { label: 'Staff', href: '/admin', icon: Users },
        { label: 'Attendance', href: '/admin', icon: Calendar },
      ],
      setup: [
        { label: 'Job Roles', href: '/admin' },
        { label: 'Pay Grades', href: '/admin' },
        { label: 'Leave Types', href: '/admin' },
      ],
      operations: [
        { label: 'Payroll', href: '/admin' },
        { label: 'Leave Management', href: '/admin' },
        { label: 'Performance Reviews', href: '/admin' },
      ],
      reports: [
        { label: 'Workforce Report', href: '/admin' },
        { label: 'Attendance Report', href: '/admin' },
      ],
    },
    defaultPermissions: ['view', 'add', 'edit', 'delete', 'export'],
  },
  {
    id: 'procurement',
    name: 'Procurement',
    description: 'Inventory, purchasing, and supplier management',
    icon: ShoppingCart,
    enabled: true,
    ribbons: {
      main: [
        { label: 'Dashboard', href: '/admin', icon: Home },
        { label: 'Inventory', href: '/admin', icon: ShoppingCart },
        { label: 'Suppliers', href: '/admin', icon: Users },
      ],
      setup: [
        { label: 'Item Categories', href: '/admin' },
        { label: 'Units of Measure', href: '/admin' },
        { label: 'Stores', href: '/admin' },
      ],
      operations: [
        { label: 'Material Requisitions', href: '/admin' },
        { label: 'Purchase Orders', href: '/admin' },
        { label: 'Goods Received', href: '/admin' },
      ],
      reports: [
        { label: 'Spend Analysis', href: '/admin' },
        { label: 'Supplier Performance', href: '/admin' },
      ],
    },
    defaultPermissions: ['view', 'add', 'edit', 'approve', 'export'],
  },
  {
    id: 'library',
    name: 'Library',
    description: 'Library management and resource tracking',
    icon: BookOpen,
    enabled: true,
    ribbons: {
      main: [
        { label: 'Dashboard', href: '/admin', icon: Home },
        { label: 'Books', href: '/admin', icon: BookOpen },
        { label: 'Members', href: '/admin', icon: Users },
      ],
      operations: [
        { label: 'Issue Books', href: '/admin' },
        { label: 'Returns', href: '/admin' },
      ],
      reports: [
        { label: 'Usage Report', href: '/admin' },
      ],
    },
    defaultPermissions: ['view', 'add', 'edit', 'export'],
  },
  {
    id: 'lms',
    name: 'Learning Management',
    description: 'E-learning platform and course content',
    icon: BookMarked,
    enabled: true,
    ribbons: {
      main: [
        { label: 'Dashboard', href: '/admin', icon: Home },
        { label: 'Courses', href: '/admin', icon: BookMarked },
        { label: 'Content', href: '/admin', icon: FileText },
      ],
      operations: [
        { label: 'Assignments', href: '/admin' },
        { label: 'Discussions', href: '/admin' },
      ],
      reports: [
        { label: 'Engagement Report', href: '/admin' },
      ],
    },
    defaultPermissions: ['view', 'add', 'edit', 'export'],
  },
  {
    id: 'system',
    name: 'System Administration',
    description: 'System settings, user management, and administration',
    icon: Settings,
    enabled: true,
    ribbons: {
      setup: [
        { label: 'Users', href: '/users', icon: Users },
        { label: 'Admin', href: '/admin', icon: Shield },
      ],
    },
    defaultPermissions: ['view', 'add', 'edit', 'delete', 'export'],
  },
]

/**
 * Get modules that contribute to a specific ribbon
 * 
 * @param ribbon - The ribbon type to filter by
 * @param enabledOnly - Whether to return only enabled modules
 * @returns Array of module configurations
 */
export function getModulesByRibbon(
  ribbon: RibbonType,
  enabledOnly = true
): ModuleConfig[] {
  return moduleRegistry.filter(
    (module) =>
      (!enabledOnly || module.enabled) &&
      module.ribbons[ribbon] &&
      module.ribbons[ribbon]!.length > 0
  )
}

/**
 * Get a module by its ID
 * 
 * @param id - Module identifier
 * @returns Module configuration or undefined
 */
export function getModuleById(id: string): ModuleConfig | undefined {
  return moduleRegistry.find((module) => module.id === id)
}

/**
 * Get all menu items for a specific ribbon
 * 
 * This flattens menu items from all modules that contribute to the ribbon.
 * 
 * @param ribbon - The ribbon type
 * @param enabledOnly - Whether to include only enabled modules
 * @returns Flattened array of menu items
 */
export function getMenuItemsForRibbon(
  ribbon: RibbonType,
  enabledOnly = true
): ModuleMenuItem[] {
  const modules = getModulesByRibbon(ribbon, enabledOnly)
  return modules.flatMap((module) => module.ribbons[ribbon] || [])
}


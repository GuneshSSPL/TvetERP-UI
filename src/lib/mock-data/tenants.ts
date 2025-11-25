/**
 * Mock Data for Super Admin Tenant Management
 * 
 * This file provides comprehensive mock data for tenant management features.
 * All functions are marked with API integration points for future implementation.
 * 
 * TODO: Replace all mock functions with actual API calls when backend is ready.
 */

import { type Tenant, type TenantModule, type TenantStatus, type TenantPlan } from '@/lib/types/tenant';

// Mock tenant data - realistic examples
export const mockTenants: Tenant[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'ABC Technical Institute',
    displayName: 'ABC Tech',
    domain: 'abc.tvet.com',
    subdomain: 'abc',
    databaseName: 'tvet_erp_abc',
    databaseHost: 'localhost',
    databasePort: 5432,
    status: 'active',
    plan: 'premium',
    subscriptionStartDate: new Date('2024-01-15'),
    subscriptionEndDate: new Date('2025-01-15'),
    maxUsers: 500,
    maxStorage: 100,
    features: ['academic', 'exams', 'finance', 'hr', 'procurement', 'library', 'lms'],
    timezone: 'Africa/Nairobi',
    locale: 'en',
    currency: 'KES',
    logoUrl: '/logos/abc-tech.png',
    primaryColor: '#0ea5e9',
    contactEmail: 'admin@abctech.ac.ke',
    contactPhone: '+254712345678',
    billingEmail: 'billing@abctech.ac.ke',
    address: {
      street: '123 Technical Street',
      city: 'Nairobi',
      state: 'Nairobi County',
      country: 'Kenya',
      postalCode: '00100',
    },
    metadata: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
    deletedAt: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'XYZ Vocational Training Center',
    displayName: 'XYZ VTC',
    domain: 'xyz.vtc.ke',
    subdomain: 'xyz',
    databaseName: 'tvet_erp_xyz',
    databaseHost: 'localhost',
    databasePort: 5432,
    status: 'active',
    plan: 'basic',
    subscriptionStartDate: new Date('2024-03-01'),
    subscriptionEndDate: new Date('2025-03-01'),
    maxUsers: 200,
    maxStorage: 50,
    features: ['academic', 'exams', 'finance'],
    timezone: 'Africa/Nairobi',
    locale: 'en',
    currency: 'KES',
    logoUrl: null,
    primaryColor: '#10b981',
    contactEmail: 'info@xyzvtc.ac.ke',
    contactPhone: '+254723456789',
    billingEmail: 'finance@xyzvtc.ac.ke',
    address: {
      street: '456 Education Avenue',
      city: 'Mombasa',
      state: 'Mombasa County',
      country: 'Kenya',
      postalCode: '80100',
    },
    metadata: {},
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-11-15'),
    deletedAt: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Kenya Polytechnic College',
    displayName: 'KPC',
    domain: null,
    subdomain: 'kpc',
    databaseName: 'tvet_erp_kpc',
    databaseHost: 'localhost',
    databasePort: 5432,
    status: 'trial',
    plan: 'free',
    subscriptionStartDate: new Date('2024-11-01'),
    subscriptionEndDate: new Date('2024-12-01'),
    maxUsers: 50,
    maxStorage: 10,
    features: ['academic', 'exams'],
    timezone: 'Africa/Nairobi',
    locale: 'en',
    currency: 'KES',
    logoUrl: null,
    primaryColor: '#8b5cf6',
    contactEmail: 'contact@kpc.ac.ke',
    contactPhone: '+254734567890',
    billingEmail: null,
    address: {
      street: '789 Polytechnic Road',
      city: 'Kisumu',
      state: 'Kisumu County',
      country: 'Kenya',
      postalCode: '40100',
    },
    metadata: {},
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
    deletedAt: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Elite Skills Academy',
    displayName: 'Elite Academy',
    domain: 'elite.skills.ac.ke',
    subdomain: 'elite',
    databaseName: 'tvet_erp_elite',
    databaseHost: 'db.example.com',
    databasePort: 5432,
    status: 'suspended',
    plan: 'premium',
    subscriptionStartDate: new Date('2024-06-01'),
    subscriptionEndDate: new Date('2025-06-01'),
    maxUsers: 1000,
    maxStorage: 200,
    features: ['academic', 'exams', 'finance', 'hr', 'procurement', 'library', 'lms', 'system'],
    timezone: 'Africa/Nairobi',
    locale: 'en',
    currency: 'KES',
    logoUrl: '/logos/elite.png',
    primaryColor: '#f59e0b',
    contactEmail: 'admin@elite.ac.ke',
    contactPhone: '+254745678901',
    billingEmail: 'accounts@elite.ac.ke',
    address: {
      street: '321 Academy Boulevard',
      city: 'Nakuru',
      state: 'Nakuru County',
      country: 'Kenya',
      postalCode: '20100',
    },
    metadata: { suspensionReason: 'Payment overdue' },
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-11-20'),
    deletedAt: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Rural Skills Development Center',
    displayName: 'RSDC',
    domain: null,
    subdomain: 'rsdc',
    databaseName: 'tvet_erp_rsdc',
    databaseHost: 'localhost',
    databasePort: 5432,
    status: 'active',
    plan: 'enterprise',
    subscriptionStartDate: new Date('2024-01-01'),
    subscriptionEndDate: new Date('2026-01-01'),
    maxUsers: 2000,
    maxStorage: 500,
    features: ['academic', 'exams', 'finance', 'hr', 'procurement', 'library', 'lms', 'system'],
    timezone: 'Africa/Nairobi',
    locale: 'en',
    currency: 'KES',
    logoUrl: null,
    primaryColor: '#ef4444',
    contactEmail: 'info@rsdc.ac.ke',
    contactPhone: '+254756789012',
    billingEmail: 'finance@rsdc.ac.ke',
    address: {
      street: '654 Development Way',
      city: 'Eldoret',
      state: 'Uasin Gishu County',
      country: 'Kenya',
      postalCode: '30100',
    },
    metadata: {},
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
    deletedAt: null,
  },
];

// Mock tenant modules data
export const mockTenantModules: Record<string, TenantModule[]> = {
  '550e8400-e29b-41d4-a716-446655440001': [
    { id: 1, tenantId: '550e8400-e29b-41d4-a716-446655440001', moduleId: 'academic', enabled: true, enabledAt: new Date('2024-01-15'), enabledBy: 1 },
    { id: 2, tenantId: '550e8400-e29b-41d4-a716-446655440001', moduleId: 'exams', enabled: true, enabledAt: new Date('2024-01-15'), enabledBy: 1 },
    { id: 3, tenantId: '550e8400-e29b-41d4-a716-446655440001', moduleId: 'finance', enabled: true, enabledAt: new Date('2024-01-15'), enabledBy: 1 },
    { id: 4, tenantId: '550e8400-e29b-41d4-a716-446655440001', moduleId: 'hr', enabled: true, enabledAt: new Date('2024-01-15'), enabledBy: 1 },
    { id: 5, tenantId: '550e8400-e29b-41d4-a716-446655440001', moduleId: 'procurement', enabled: true, enabledAt: new Date('2024-01-15'), enabledBy: 1 },
    { id: 6, tenantId: '550e8400-e29b-41d4-a716-446655440001', moduleId: 'library', enabled: true, enabledAt: new Date('2024-01-15'), enabledBy: 1 },
    { id: 7, tenantId: '550e8400-e29b-41d4-a716-446655440001', moduleId: 'lms', enabled: true, enabledAt: new Date('2024-01-15'), enabledBy: 1 },
  ],
  '550e8400-e29b-41d4-a716-446655440002': [
    { id: 8, tenantId: '550e8400-e29b-41d4-a716-446655440002', moduleId: 'academic', enabled: true, enabledAt: new Date('2024-03-01'), enabledBy: 1 },
    { id: 9, tenantId: '550e8400-e29b-41d4-a716-446655440002', moduleId: 'exams', enabled: true, enabledAt: new Date('2024-03-01'), enabledBy: 1 },
    { id: 10, tenantId: '550e8400-e29b-41d4-a716-446655440002', moduleId: 'finance', enabled: true, enabledAt: new Date('2024-03-01'), enabledBy: 1 },
  ],
  '550e8400-e29b-41d4-a716-446655440003': [
    { id: 11, tenantId: '550e8400-e29b-41d4-a716-446655440003', moduleId: 'academic', enabled: true, enabledAt: new Date('2024-11-01'), enabledBy: 1 },
    { id: 12, tenantId: '550e8400-e29b-41d4-a716-446655440003', moduleId: 'exams', enabled: true, enabledAt: new Date('2024-11-01'), enabledBy: 1 },
  ],
};

// Mock dashboard statistics
export interface DashboardStats {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  tenantsByPlan: Record<TenantPlan, number>;
  tenantsByStatus: Record<TenantStatus, number>;
  recentRegistrations: number; // Last 30 days
}

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: GET /api/super-admin/dashboard/stats
 * Expected Response: { totalTenants, activeTenants, trialTenants, suspendedTenants, tenantsByPlan, tenantsByStatus, recentRegistrations }
 * Error Handling: Return error object if API call fails
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export async function mockGetDashboardStats(): Promise<DashboardStats> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const stats: DashboardStats = {
    totalTenants: mockTenants.length,
    activeTenants: mockTenants.filter((t) => t.status === 'active').length,
    trialTenants: mockTenants.filter((t) => t.status === 'trial').length,
    suspendedTenants: mockTenants.filter((t) => t.status === 'suspended').length,
    tenantsByPlan: {
      free: mockTenants.filter((t) => t.plan === 'free').length,
      basic: mockTenants.filter((t) => t.plan === 'basic').length,
      premium: mockTenants.filter((t) => t.plan === 'premium').length,
      enterprise: mockTenants.filter((t) => t.plan === 'enterprise').length,
    },
    tenantsByStatus: {
      active: mockTenants.filter((t) => t.status === 'active').length,
      inactive: mockTenants.filter((t) => t.status === 'inactive').length,
      suspended: mockTenants.filter((t) => t.status === 'suspended').length,
      trial: mockTenants.filter((t) => t.status === 'trial').length,
    },
    recentRegistrations: mockTenants.filter(
      (t) => t.createdAt && new Date(t.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    ).length,
  };

  return stats;
}

export interface TenantFilters {
  status?: TenantStatus;
  plan?: TenantPlan;
  search?: string;
}

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: GET /api/super-admin/tenants?status=active&plan=premium&search=abc
 * Query Parameters:
 *   - status: Filter by tenant status
 *   - plan: Filter by subscription plan
 *   - search: Search by name or subdomain
 * Expected Response: { tenants: Tenant[], total: number, page: number, pageSize: number }
 * Error Handling: Return error object if API call fails
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export async function mockGetTenants(filters?: TenantFilters): Promise<{ tenants: Tenant[]; total: number }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  let filtered = [...mockTenants];

  if (filters?.status) {
    filtered = filtered.filter((t) => t.status === filters.status);
  }

  if (filters?.plan) {
    filtered = filtered.filter((t) => t.plan === filters.plan);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(searchLower) ||
        t.displayName?.toLowerCase().includes(searchLower) ||
        t.subdomain.toLowerCase().includes(searchLower)
    );
  }

  return {
    tenants: filtered,
    total: filtered.length,
  };
}

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: GET /api/super-admin/tenants/[id]
 * Expected Response: { tenant: Tenant, modules: TenantModule[] }
 * Error Handling: Return 404 error if tenant not found
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export async function mockGetTenantById(id: string): Promise<{ tenant: Tenant; modules: TenantModule[] }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const tenant = mockTenants.find((t) => t.id === id);
  if (!tenant) {
    throw new Error('Tenant not found');
  }

  const modules = mockTenantModules[id] || [];

  return { tenant, modules };
}

export interface TenantRegistrationData {
  name: string;
  displayName?: string;
  domain?: string;
  subdomain: string;
  databaseName: string;
  databaseHost?: string;
  databasePort?: number;
  plan: TenantPlan;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  maxUsers?: number;
  maxStorage?: number;
  features?: string[];
  timezone?: string;
  locale?: string;
  currency?: string;
  logoUrl?: string;
  primaryColor?: string;
  contactEmail: string;
  contactPhone?: string;
  billingEmail?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  metadata?: Record<string, unknown>;
}

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: POST /api/super-admin/tenants
 * Request Body: TenantRegistrationData
 * Expected Response: { id: string, ...tenant }
 * Error Handling: Return validation errors or conflict errors
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export async function mockRegisterTenant(data: TenantRegistrationData): Promise<Tenant> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if subdomain already exists
  if (mockTenants.some((t) => t.subdomain === data.subdomain)) {
    throw new Error('Subdomain already exists');
  }

  const newTenant: Tenant = {
    id: `550e8400-e29b-41d4-a716-44665544000${mockTenants.length + 1}`,
    name: data.name,
    displayName: data.displayName || data.name,
    domain: data.domain || null,
    subdomain: data.subdomain,
    databaseName: data.databaseName,
    databaseHost: data.databaseHost || 'localhost',
    databasePort: data.databasePort || 5432,
    status: 'trial',
    plan: data.plan,
    subscriptionStartDate: data.subscriptionStartDate || new Date(),
    subscriptionEndDate: data.subscriptionEndDate || null,
    maxUsers: data.maxUsers || null,
    maxStorage: data.maxStorage || null,
    features: data.features || [],
    timezone: data.timezone || 'UTC',
    locale: data.locale || 'en',
    currency: data.currency || 'USD',
    logoUrl: data.logoUrl || null,
    primaryColor: data.primaryColor || null,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone || null,
    billingEmail: data.billingEmail || null,
    address: data.address || null,
    metadata: data.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  // Add to mock data
  mockTenants.push(newTenant);

  return newTenant;
}

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: PUT /api/super-admin/tenants/[id]
 * Request Body: Partial<Tenant>
 * Expected Response: { ...updatedTenant }
 * Error Handling: Return validation errors or 404 if not found
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export async function mockUpdateTenant(id: string, data: Partial<Tenant>): Promise<Tenant> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const index = mockTenants.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error('Tenant not found');
  }

  const updated = {
    ...mockTenants[index],
    ...data,
    updatedAt: new Date(),
  };

  mockTenants[index] = updated;

  return updated;
}

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: POST /api/super-admin/tenants/[id]/modules
 * Request Body: { moduleId: string, enabled: boolean }
 * Expected Response: { module: TenantModule }
 * Error Handling: Return error if tenant or module not found
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export async function mockToggleModule(
  tenantId: string,
  moduleId: string,
  enabled: boolean
): Promise<TenantModule> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const tenantModules = mockTenantModules[tenantId] || [];
  let module = tenantModules.find((m) => m.moduleId === moduleId);

  if (module) {
    // Update existing
    module = {
      ...module,
      enabled,
      enabledAt: enabled ? new Date() : null,
    };
    const index = tenantModules.findIndex((m) => m.moduleId === moduleId);
    tenantModules[index] = module;
  } else {
    // Create new
    module = {
      id: tenantModules.length + 1,
      tenantId,
      moduleId,
      enabled,
      enabledAt: enabled ? new Date() : null,
      enabledBy: 1, // Mock super admin user ID
    };
    tenantModules.push(module);
  }

  mockTenantModules[tenantId] = tenantModules;

  return module;
}

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: PATCH /api/super-admin/tenants/[id]/status
 * Request Body: { status: TenantStatus }
 * Expected Response: { ...updatedTenant }
 * Error Handling: Return error if tenant not found or invalid status
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export async function mockUpdateTenantStatus(id: string, status: TenantStatus): Promise<Tenant> {
  return mockUpdateTenant(id, { status });
}

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: PATCH /api/super-admin/tenants/[id]/plan
 * Request Body: { plan: TenantPlan }
 * Expected Response: { ...updatedTenant }
 * Error Handling: Return error if tenant not found or invalid plan
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export async function mockUpdateTenantPlan(id: string, plan: TenantPlan): Promise<Tenant> {
  return mockUpdateTenant(id, { plan });
}

/**
 * API Integration Point
 * 
 * TODO: Replace mock implementation with actual API call
 * 
 * Endpoint: DELETE /api/super-admin/tenants/[id]
 * Expected Response: { success: true }
 * Error Handling: Return error if tenant not found
 * 
 * Current: Using mock data from lib/mock-data/tenants.ts
 */
export async function mockDeleteTenant(id: string): Promise<{ success: boolean }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = mockTenants.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error('Tenant not found');
  }

  // Soft delete
  mockTenants[index] = {
    ...mockTenants[index],
    deletedAt: new Date(),
    status: 'inactive',
  };

  return { success: true };
}


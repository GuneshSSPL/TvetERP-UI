/**
 * Tenant Type Definitions
 * 
 * TypeScript types for tenant management.
 * Extracted from database schema for use across the application.
 */

export type TenantStatus = 'active' | 'inactive' | 'suspended' | 'trial';
export type TenantPlan = 'free' | 'basic' | 'premium' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  displayName: string | null;
  domain: string | null;
  subdomain: string;
  databaseName: string;
  databaseHost: string | null;
  databasePort: number | null;
  status: TenantStatus;
  plan: TenantPlan;
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
  maxUsers: number | null;
  maxStorage: number | null; // in GB
  features: string[] | null; // Array of enabled module IDs
  timezone: string | null;
  locale: string | null;
  currency: string | null;
  logoUrl: string | null;
  primaryColor: string | null; // Hex color
  contactEmail: string | null;
  contactPhone: string | null;
  billingEmail: string | null;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  } | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface TenantModule {
  id: number;
  tenantId: string;
  moduleId: string;
  enabled: boolean;
  enabledAt: Date | null;
  enabledBy: number | null;
}


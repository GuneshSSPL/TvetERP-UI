/**
 * Validation Schemas for Tenant Management
 * 
 * Zod schemas for tenant registration, updates, and module management.
 * All validation works client-side and will work seamlessly with API integration.
 */

import { z } from 'zod';

// Tenant status and plan enums
export const tenantStatusSchema = z.enum(['active', 'inactive', 'suspended', 'trial']);
export const tenantPlanSchema = z.enum(['free', 'basic', 'premium', 'enterprise']);

// Address schema
export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

// Tenant registration schema - comprehensive validation
export const tenantRegistrationSchema = z
  .object({
    // Basic Information
    name: z.string().min(3, 'Name must be at least 3 characters').max(255, 'Name too long'),
    displayName: z.string().max(255, 'Display name too long').optional(),
    
    // Domain Configuration
    domain: z
      .string()
      .regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, 'Invalid domain format')
      .optional()
      .or(z.literal('')),
    subdomain: z
      .string()
      .min(2, 'Subdomain must be at least 2 characters')
      .max(100, 'Subdomain too long')
      .regex(/^[a-z0-9]([a-z0-9-]{0,98}[a-z0-9])?$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
      .refine((val) => !val.startsWith('-') && !val.endsWith('-'), 'Subdomain cannot start or end with hyphen'),
    
    // Database Settings
    databaseName: z
      .string()
      .min(3, 'Database name must be at least 3 characters')
      .max(100, 'Database name too long')
      .regex(/^[a-z0-9_]+$/, 'Database name can only contain lowercase letters, numbers, and underscores'),
    databaseHost: z.string().max(255, 'Database host too long').optional(),
    databasePort: z.number().int().min(1).max(65535).optional(),
    
    // Subscription
    plan: tenantPlanSchema,
    subscriptionStartDate: z.date().optional(),
    subscriptionEndDate: z.date().optional(),
    maxUsers: z.number().int().positive().optional(),
    maxStorage: z.number().int().positive().optional(), // in GB
    
    // Branding
    logoUrl: z.string().url('Invalid logo URL').optional().or(z.literal('')),
    primaryColor: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a valid hex color (e.g., #0ea5e9)')
      .optional(),
    
    // Contact Information
    contactEmail: z.string().email('Invalid email address'),
    contactPhone: z.string().max(50, 'Phone number too long').optional(),
    billingEmail: z.string().email('Invalid billing email').optional().or(z.literal('')),
    
    // Address
    address: addressSchema.optional(),
    
    // Localization
    timezone: z.string().max(50, 'Timezone too long').optional(),
    locale: z.string().length(2, 'Locale must be 2 characters (e.g., en)').optional(),
    currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)').optional(),
    
    // Initial Module Selection
    features: z.array(z.string()).optional(),
    
    // Metadata
    metadata: z.record(z.unknown()).optional(),
  })
  .refine(
    (data) => {
      if (data.subscriptionEndDate && data.subscriptionStartDate) {
        return data.subscriptionEndDate > data.subscriptionStartDate;
      }
      return true;
    },
    {
      message: 'Subscription end date must be after start date',
      path: ['subscriptionEndDate'],
    }
  );

export type TenantRegistrationData = z.infer<typeof tenantRegistrationSchema>;

// Tenant update schema - allows partial updates
export const tenantUpdateSchema = tenantRegistrationSchema.partial().extend({
  // Some fields should not be updatable after creation
  subdomain: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]([a-z0-9-]{0,98}[a-z0-9])?$/)
    .optional(),
  databaseName: z.string().min(3).max(100).regex(/^[a-z0-9_]+$/).optional(),
});

export type TenantUpdateData = z.infer<typeof tenantUpdateSchema>;

// Module toggle schema
export const tenantModuleSchema = z.object({
  moduleId: z.string().min(1, 'Module ID is required'),
  enabled: z.boolean(),
});

export type TenantModuleData = z.infer<typeof tenantModuleSchema>;

// Tenant status update schema
export const tenantStatusUpdateSchema = z.object({
  status: tenantStatusSchema,
});

export type TenantStatusUpdateData = z.infer<typeof tenantStatusUpdateSchema>;

// Tenant plan update schema
export const tenantPlanUpdateSchema = z.object({
  plan: tenantPlanSchema,
});

export type TenantPlanUpdateData = z.infer<typeof tenantPlanUpdateSchema>;


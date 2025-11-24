/**
 * Demo Themes Configuration
 * 
 * Real-world TVET institutions with 4-color palettes for comprehensive theming.
 * Each theme uses a 4-color palette for better visual hierarchy and theming.
 * 
 * Color Palette Structure:
 * - primary: Main brand color (darkest, used for primary actions)
 * - secondary: Secondary accent (medium-dark, used for hover states)
 * - tertiary: Tertiary accent (medium-light, used for accents)
 * - quaternary: Lightest accent (lightest, used for subtle highlights)
 * 
 * Logos are sourced from Vecteezy and should be replaced with
 * actual institution logos in production.
 */

import { type TenantConfig } from '@/context/tenant-theme-provider'

/**
 * Generate SVG logo data URI from color palette
 * Creates a simple logo with institution initials in a colored square
 */
function generateLogoSvg(primaryColor: string, name: string): string {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  // Create SVG with proper encoding
  const svg = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="${primaryColor}"/>
  <text x="32" y="40" dominant-baseline="middle" text-anchor="middle" 
        font-family="Roboto, sans-serif" font-size="20" font-weight="bold" 
        fill="white">${initials}</text>
</svg>`

  // URL encode the SVG for data URI
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Real-world TVET institutions with 4-color palettes
 */
export const demoThemes: TenantConfig[] = [
  {
    colorPalette: {
      primary: '#B33791', // Deep magenta
      secondary: '#C562AF', // Medium magenta
      tertiary: '#DB8DD0', // Light magenta
      quaternary: '#FEC5F6', // Lightest pink
    },
    primaryColor: '#B33791', // For backward compatibility
    name: 'Nairobi Technical Training Institute',
    logoUrl: generateLogoSvg('#B33791', 'Nairobi Technical Training Institute'),
    logo: '🎓',
  },
  {
    colorPalette: {
      primary: '#1e40af', // Deep blue
      secondary: '#3b82f6', // Medium blue
      tertiary: '#60a5fa', // Light blue
      quaternary: '#bfdbfe', // Lightest blue
    },
    primaryColor: '#1e40af',
    name: 'Kenya Institute of Applied Sciences',
    logoUrl: generateLogoSvg('#1e40af', 'Kenya Institute of Applied Sciences'),
    logo: '🎓',
  },
  {
    colorPalette: {
      primary: '#7c3aed', // Deep purple
      secondary: '#a855f7', // Medium purple
      tertiary: '#c084fc', // Light purple
      quaternary: '#e9d5ff', // Lightest purple
    },
    primaryColor: '#7c3aed',
    name: 'Mombasa Vocational Training College',
    logoUrl: generateLogoSvg('#7c3aed', 'Mombasa Vocational Training College'),
    logo: '🎓',
  },
]

/**
 * Default theme (used on initial load)
 */
export const defaultTheme: TenantConfig = {
  colorPalette: {
    primary: '#0ea5e9', // Sky blue
    secondary: '#38bdf8', // Light sky blue
    tertiary: '#7dd3fc', // Lighter sky blue
    quaternary: '#bae6fd', // Lightest sky blue
  },
  primaryColor: '#0ea5e9',
  name: 'TVET ERP',
  logoUrl: generateLogoSvg('#0ea5e9', 'TVET ERP'),
  logo: '🎓',
}

/**
 * Get theme by name
 */
export function getThemeByName(name: string): TenantConfig | undefined {
  return demoThemes.find((theme) => theme.name === name)
}

/**
 * Get theme by primary color
 */
export function getThemeByColor(color: string): TenantConfig | undefined {
  return demoThemes.find((theme) => theme.primaryColor === color)
}


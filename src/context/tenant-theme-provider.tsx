'use client'

import { ReactNode, createContext, useContext, useState, useEffect } from 'react'

/**
 * Color Palette Structure
 * 4-color palette for comprehensive theming:
 * - primary: Main brand color (darkest)
 * - secondary: Secondary accent (medium-dark)
 * - tertiary: Tertiary accent (medium-light)
 * - quaternary: Lightest accent (lightest)
 */
export interface ColorPalette {
  primary: string // Main brand color (e.g., "#B33791")
  secondary: string // Secondary accent (e.g., "#C562AF")
  tertiary: string // Tertiary accent (e.g., "#DB8DD0")
  quaternary: string // Lightest accent (e.g., "#FEC5F6")
}

export interface TenantConfig {
  /** 4-color palette for comprehensive theming */
  colorPalette: ColorPalette
  /** Primary color (for backward compatibility, uses palette.primary) */
  primaryColor?: string
  name?: string
  logoUrl?: string
  logo?: string // Emoji or SVG
}

interface TenantThemeProviderProps {
  children: ReactNode
  tenantConfig: TenantConfig
}

interface TenantContextValue {
  config: TenantConfig
  setTheme: (config: TenantConfig) => void
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined)

// Convert hex to OKLCH format (simplified approximation)
function hexToOklch(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '')
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  
  // Convert to linear RGB
  const toLinear = (c: number) => 
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  
  const rLinear = toLinear(r)
  const gLinear = toLinear(g)
  const bLinear = toLinear(b)
  
  // Convert to OKLab (simplified)
  const l = 0.4122214708 * rLinear + 0.5363325363 * gLinear + 0.0514459929 * bLinear
  const m = 0.2119034982 * rLinear + 0.6806995451 * gLinear + 0.1073969566 * bLinear
  const s = 0.0883024619 * rLinear + 0.2817188376 * gLinear + 0.6299787005 * bLinear
  
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)
  
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const aLab = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  
  // Convert to OKLCH
  const C = Math.sqrt(aLab * aLab + bLab * bLab)
  const H = Math.atan2(bLab, aLab) * (180 / Math.PI)
  const HNormalized = H < 0 ? H + 360 : H
  
  // Clamp values for OKLCH
  const L_clamped = Math.max(0, Math.min(1, L))
  const C_clamped = Math.max(0, Math.min(0.4, C))
  const H_clamped = HNormalized || 0
  
  return `oklch(${L_clamped.toFixed(3)} ${C_clamped.toFixed(3)} ${H_clamped.toFixed(1)})`
}

export function TenantThemeProvider({
  children,
  tenantConfig: initialConfig,
}: TenantThemeProviderProps) {
  const [config, setConfig] = useState<TenantConfig>(initialConfig)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    try {
      const root = window.document.documentElement
      const palette = config.colorPalette || {
        primary: config.primaryColor || '#0ea5e9',
        secondary: config.primaryColor || '#0ea5e9',
        tertiary: config.primaryColor || '#0ea5e9',
        quaternary: config.primaryColor || '#0ea5e9',
      }

      // Convert all palette colors to OKLCH
      const primaryOklch = hexToOklch(palette.primary)
      const secondaryOklch = hexToOklch(palette.secondary)
      const tertiaryOklch = hexToOklch(palette.tertiary)
      const quaternaryOklch = hexToOklch(palette.quaternary)

      if (root) {
        // Primary colors
        root.style.setProperty('--primary', primaryOklch)
        root.style.setProperty('--primary-foreground', 'oklch(0.984 0.003 247.858)')
        
        // Secondary colors (for accents, hover states)
        root.style.setProperty('--secondary', secondaryOklch)
        root.style.setProperty('--secondary-foreground', 'oklch(0.984 0.003 247.858)')
        
        // Tertiary colors (for subtle accents)
        root.style.setProperty('--tertiary', tertiaryOklch)
        root.style.setProperty('--tertiary-foreground', 'oklch(0.129 0.042 264.695)')
        root.style.setProperty('--accent', tertiaryOklch)
        root.style.setProperty('--accent-foreground', 'oklch(0.129 0.042 264.695)')
        
        // Chart colors (using palette)
        root.style.setProperty('--chart-1', primaryOklch)
        root.style.setProperty('--chart-2', secondaryOklch)
        root.style.setProperty('--chart-3', tertiaryOklch)
        root.style.setProperty('--chart-4', quaternaryOklch)
        root.style.setProperty('--chart-5', primaryOklch) // Reuse primary for 5th chart
        
        // Hover states (lighter version of primary)
        const hoverOklch = hexToOklch(palette.secondary) // Use secondary for hover
        root.style.setProperty('--primary-hover', hoverOklch)
        
        // Ring/focus states
        root.style.setProperty('--ring', primaryOklch)
      }
    } catch (error) {
      console.warn('Failed to set theme CSS variables:', error)
    }
  }, [config, mounted])

  const setTheme = (newConfig: TenantConfig) => {
    setConfig(newConfig)
  }

  return (
    <TenantContext.Provider value={{ config, setTheme }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenantTheme() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenantTheme must be used within TenantThemeProvider')
  }
  return context
}


/**
 * Color Utility Functions
 * 
 * Utilities for color manipulation and conversion.
 * Used for theme system and color palette management.
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return { r, g, b }
}

/**
 * Convert hex color to RGB string
 */
export function hexToRgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Convert hex color to RGBA string
 */
export function hexToRgbaString(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Lighten a hex color by a percentage
 */
export function lightenHex(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex)
  const factor = 1 + percent / 100
  const newR = Math.min(255, Math.round(r * factor))
  const newG = Math.min(255, Math.round(g * factor))
  const newB = Math.min(255, Math.round(b * factor))
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

/**
 * Darken a hex color by a percentage
 */
export function darkenHex(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex)
  const factor = 1 - percent / 100
  const newR = Math.max(0, Math.round(r * factor))
  const newG = Math.max(0, Math.round(g * factor))
  const newB = Math.max(0, Math.round(b * factor))
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}


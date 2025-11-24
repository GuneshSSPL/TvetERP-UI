/**
 * Bar Chart Component
 * 
 * Reusable bar chart component using Recharts.
 * Automatically uses theme colors from the color palette.
 * 
 * Use Cases:
 * - Revenue/collection charts
 * - Enrollment trends
 * - Performance comparisons
 * - Fee arrears aging
 * 
 * @see Tvet Erp Requirements Questions (6).txt Section 12.4
 */

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTenantTheme } from '@/context/tenant-theme-provider'

interface BarChartData {
  name: string
  [key: string]: string | number
}

interface BarChartProps {
  /** Chart title */
  title: string
  /** Chart description */
  description?: string
  /** Chart data */
  data: BarChartData[]
  /** Data keys to display (bars) */
  dataKeys: string[]
  /** X-axis key (usually 'name') */
  xAxisKey?: string
  /** Chart height */
  height?: number
  /** Show legend */
  showLegend?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Bar Chart Component
 * 
 * Automatically uses theme colors from the institution's color palette.
 */
export function BarChart({
  title,
  description,
  data,
  dataKeys,
  xAxisKey = 'name',
  height = 300,
  showLegend = true,
  className,
}: BarChartProps) {
  const { config } = useTenantTheme()
  const palette = config.colorPalette || {
    primary: config.primaryColor || '#0ea5e9',
    secondary: config.primaryColor || '#0ea5e9',
    tertiary: config.primaryColor || '#0ea5e9',
    quaternary: config.primaryColor || '#0ea5e9',
  }

  // Map data keys to palette colors
  const colorMap = [
    palette.primary,
    palette.secondary,
    palette.tertiary,
    palette.quaternary,
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={height}>
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey={xAxisKey}
              className='text-xs text-muted-foreground'
              tick={{ fill: 'currentColor' }}
            />
            <YAxis className='text-xs text-muted-foreground' tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            {showLegend && (
              <Legend
                wrapperStyle={{ color: 'hsl(var(--foreground))' }}
                iconType='rect'
              />
            )}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colorMap[index % colorMap.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}


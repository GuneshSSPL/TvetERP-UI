/**
 * Scatter Plot Component
 * 
 * Reusable scatter plot component using Recharts.
 * Automatically uses theme colors from the color palette.
 * 
 * Use Cases:
 * - Performance analysis (grades vs attendance)
 * - Correlation analysis
 * - Competency vs assessment scores
 * - Student progress tracking
 * 
 * @see Tvet Erp Requirements Questions (6).txt Section 12.4
 */

import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTenantTheme } from '@/context/tenant-theme-provider'

interface ScatterDataPoint {
  x: number
  y: number
  name?: string
}

interface ScatterChartProps {
  /** Chart title */
  title: string
  /** Chart description */
  description?: string
  /** Chart data (array of data series) */
  data: Array<{
    name: string
    data: ScatterDataPoint[]
  }>
  /** X-axis label */
  xAxisLabel?: string
  /** Y-axis label */
  yAxisLabel?: string
  /** Chart height */
  height?: number
  /** Show legend */
  showLegend?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Scatter Plot Component
 * 
 * Automatically uses theme colors from the institution's color palette.
 */
export function ScatterChart({
  title,
  description,
  data,
  xAxisLabel = 'X Axis',
  yAxisLabel = 'Y Axis',
  height = 300,
  showLegend = true,
  className,
}: ScatterChartProps) {
  const { config } = useTenantTheme()
  const palette = config.colorPalette || {
    primary: config.primaryColor || '#0ea5e9',
    secondary: config.primaryColor || '#0ea5e9',
    tertiary: config.primaryColor || '#0ea5e9',
    quaternary: config.primaryColor || '#0ea5e9',
  }

  // Map data series to palette colors
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
          <RechartsScatterChart>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              type='number'
              dataKey='x'
              name={xAxisLabel}
              className='text-xs text-muted-foreground'
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              type='number'
              dataKey='y'
              name={yAxisLabel}
              className='text-xs text-muted-foreground'
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
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
                iconType='circle'
              />
            )}
            {data.map((series, index) => (
              <Scatter
                key={series.name}
                name={series.name}
                data={series.data}
                fill={colorMap[index % colorMap.length]}
              />
            ))}
          </RechartsScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

